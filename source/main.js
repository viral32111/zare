// Import required modules
const nacl = require( "tweetnacl" );
const buffer = require( "buffer" );

// Import the credentials
const credentials = require( "./credentials.json" );

// Called to process incoming HTTP requests...
async function processRequest( request ) {

	// Get the path from the request URL
	const requestPath = new URL( request.url ).pathname;

	// If the request is to the root of the URL...
	if ( requestPath == "/" ) {

		// Get the important request details
		const discordSignature = request.headers.get( "x-signature-ed25519" );
		const discordTimestamp = request.headers.get( "x-signature-timestamp" );
		const requestBody = await request.clone().text();

		// If those details don't exist then respond with a 403 forbidden
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
			buffer.Buffer.from( credentials.publicKey, "hex" )
		);

		// If the signature is invalid then respond with a 401 unauthorised
		if ( !isSignatureValid ) return new Response( null, { status: 401 } );

		// Get the interaction JSON data
		const interactionsPayload = await request.clone().json();

		// Is this a ping?
		if ( interactionsPayload[ "type" ] == 1 ) {

			// Acknowledge the ping as a 200 ok
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

			// Return the response data as a 200 ok
			return new Response( JSON.stringify( responseData ), {
				status: 200,
				headers: {
					"content-type": "application/json"
				}
			} );

		}

	// If the request path is to update the slash commands...
	} else if ( requestPath == "/update" ) {

		// Use the application's secret as authorization so random people don't open this URL
		if ( request.headers.get( "authorization" ) != credentials.secret ) return new Response( null, { status: 403 } );

		const accessToken = ""; // change me when it expires, fetch new one with request below

		// Fetch a bearer token using client credentials grant
		/* const tokenResponse = await fetch( "https://discord.com/api/v8/oauth2/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Authorization": "Basic " + btoa( credentials.id + ":" + credentials.secret )
			},
			body: "grant_type=client_credentials&scope=applications.commands.update"
		} );
		const accessToken = ( await tokenResponse.json() )[ "access_token" ];
		console.debug( accessToken ); */

		// delete command
		/* const deleteResponse = await fetch( "https://discord.com/api/v8/applications/" + credentials.id + "/commands/841711610119847966", {
			method: "DELETE",
			headers: { "Authorization": "Bearer " + accessToken }
		} );
		console.debug( deleteResponse.status, deleteResponse.statusText, ( await deleteResponse.text() ) ); */
	
		// Create/update global slash commands
		/* const commandResponse = await fetch( "https://discord.com/api/v8/applications/" + credentials.id + "/commands", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + accessToken
			},
			body: JSON.stringify( [
				{
					"name": "server",
					"description": "Interact with the Dedicated Server.",
					"default_permission": false,
					"options": [
						{
							"type": 1,
							"name": "info",
							"description": "View information about the server."
						},
						{
							"type": 1,
							"name": "status",
							"description": "Show the current status of the server."
						},
						{
							"type": 1,
							"name": "graph",
							"description": "Visually display networking statistics over a certain time range.",
							"options": [
								{
									"type": 3,
									"name": "type",
									"description": "The type of statistic.",
									"required": true,
									"choices": [
										{ "name": "Traffic", "value": "traffic" },
										{ "name": "Packets Per Second", "value": "pps" },
										{ "name": "Average Packet Size", "value": "size" },
										{ "name": "Port Utilization", "value": "utilization" },
										{ "name": "Port Errors", "value": "errors" }
									]
								},
								{
									"type": 3,
									"name": "range",
									"description": "The time range.",
									"required": true,
									"choices": [
										{ "name": "Day", "value": "day" },
										{ "name": "Week", "value": "week" },
										{ "name": "Month", "value": "month" }
									]
								}
							]
						},
						{
							"type": 2,
							"name": "power",
							"description": "Start, stop and reboot the server.",
							"options": [
								{
									"type": 1,
									"name": "on",
									"description": "Turn on the server.",
								},
								{
									"type": 1,
									"name": "off",
									"description": "Hard shutdown the server. This will instantly kill it, use with caution.",
								},
								{
									"type": 1,
									"name": "cycle",
									"description": "Reboot the server.",
								}
							]
						},
						{
							"type": 2,
							"name": "console",
							"description": "Access the server's remote management interface.",
							"options": [
								{
									"type": 1,
									"name": "credentials",
									"description": "Generate credentials to access the server's IPMI/iKVM unit.",
								},
								{
									"type": 1,
									"name": "reset",
									"description": "Reset the BMC unit. This very rarely need to be done.",
								}
							]
						}
					]
				}
			] )
		} );
		const commandID = ( await commandResponse.json() )[ 0 ][ "id" ];
		console.log( commandResponse.status, commandResponse.statusText, commandID ); // ( await commandResponse.text() )

		// Set permissions for the slash command
		const permissionsResponse = await fetch( "https://discord.com/api/v8/applications/" + credentials.id + "/guilds/" + credentials.guild + "/commands/" + commandID + "/permissions", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + accessToken
			},
			body: JSON.stringify( {
				"permissions": [
					{
						"id": credentials.me,
						"type": 2,
						"permission": true
					}
				]
			} )
		} );
		console.debug( permissionsResponse.status, permissionsResponse.statusText, ( await permissionsResponse.text() ) ); */

		// Respond with a 200 ok
		return new Response( null, { status: 200 } );

	}

	// Fallback to responding with a 400 bad request
	return new Response( null, { status: 400 } );

}

// Called to process executed interactions...
async function processInteraction( interaction ) {

	if ( interaction[ "member" ][ "user" ][ "id" ] == credentials.me ) {
		return {
			"type": 4,
			"data": {
				"content": ":no_entry_sign:"
			}
		}
	}

	return {
		"type": 4,
		"data": {
			"content": "```json\n" + JSON.stringify( interaction, null, 4 ) + "\n```"
		}
	}

	/*
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
	*/

}

// Register the event listener for incoming HTTP requests
addEventListener( "fetch", function( event ) {
	event.respondWith( processRequest( event.request ) );
} );
