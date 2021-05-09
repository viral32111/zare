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
	if ( !discordSignature || !discordTimestamp || !requestBody ) {
		return new Response( "You're not meant to be here, fuck off!\n\nhttps://viral32111.com", {
			status: 403,
			headers: {
				"content-type": "text/plain; charset=utf-8"
			}
		} );
	}

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
			"type": 1
		} ), {
			status: 200,
			headers: {
				"content-type": "application/json"
			}
		} );

	// Is this an interaction execution?
	} else if ( interactionsPayload[ "type" ] == 2 ) {

		// Process the interaction and store the response data
		const responseData = await processInteraction( interactionsPayload );

		// Return the response data
		return new Response( JSON.stringify( responseData ), {
			status: 200,
			headers: {
				"content-type": "application/json"
			}
		} );

	}

	// Fallback to responding with a 200 ok
	return new Response( null, { status: 200 } );

}

// Called to process executed interactions...
async function processInteraction( interaction ) {

	// Setup variables for later use
	const commandName = interaction[ "data" ][ "name" ];
	const guildID = interaction[ "guild_id" ];
	const channelID = interaction[ "channel_id" ];
	const userID = interaction[ "member" ][ "user" ][ "id" ];
	const userName = interaction[ "member" ][ "user" ][ "username" ];
	const userTag = interaction[ "member" ][ "user" ][ "discriminator" ];

	// Is this the status command?
	if ( commandName == "status" ) {

		// blah
		return {
			"type": 4,
			"data": {
				"content": "No status information available yet, I'm still in development!"
			}
		}

	// This is an unknown command!
	} else {

		// Return an error
		return {
			"type": 4,
			"data": {
				"content": "This command has no handler!",
				"flags": 64
			}
		}

	}

}


// Register the event listener for incoming HTTP requests
addEventListener( "fetch", function( event ) {
	event.respondWith( processRequest( event.request ) );
} );
