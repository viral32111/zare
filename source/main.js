// These things are required
const nacl = require( "tweetnacl" );
const buffer = require( "buffer" );

// The application's information
const discordClientID = "";
const discordPublicKey = "";

// Called to process incoming HTTP requests...
async function processRequest( request ) {

	// Get the important request details
	const discordSignature = request.headers.get( "x-signature-ed25519" );
	const discordTimestamp = request.headers.get( "x-signature-timestamp" );
	const requestBody = await request.clone().text();

	// If those details don't exist then respond with 400 bad request
	if ( !discordSignature || !discordTimestamp || !requestBody ) return new Response( null, { status: 400 } );

	// Verify the signature
	const isSignatureValid = nacl.sign.detached.verify(
		buffer.Buffer.from( discordTimestamp + requestBody ),
		buffer.Buffer.from( discordSignature, "hex" ),
		buffer.Buffer.from( discordPublicKey, "hex" )
	);

	// If the signature is invalid then respond with 401 unauthorised
	if ( !isSignatureValid ) return new Response( null, { status: 401 } );

	// Get the interaction JSON data
	const interactionsPayload = await request.clone().json();

	// Is this a ping?
	if ( interactionsPayload[ "type" ] == 1 ) {

		// Ack the ping
		return new Response( JSON.stringify( {
			type: 1
		} ), { status: 200, headers: { "content-type": "application/json" } } );

	// Is this a command execution?
	} else if ( interactionsPayload[ "type" ] == 2 ) {
		// fancy stuff goes here in the future
	}

	// Fallback to responding with a 200 ok
	return new Response( null, { status: 200 } );

}

// Register the event listener for incoming HTTP requests
addEventListener( "fetch", function( event ) {
	event.respondWith( processRequest( event.request ) );
} );
