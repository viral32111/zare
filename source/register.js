// Import required modules
const http = require( "axios" );

// Application and bot details
const appID = "";
const guildID = "";
const botToken = "";

// Helper function for quickly registering a command
function registerCommand( command ) {

	// Send a request to the API...
	http.post( "https://discord.com/api/v8/applications/" + appID + "/guilds/" + guildID + "/commands", command, {
		headers: {
			"Authorization": "Bot " + botToken
		}
	} ).then( function( response ) {

		// Show simple message if it was successful
		if ( response.status == 200 || response.status == 201 || response.status == 204 ) {
			console.log( "Successfully registered command '/" + command[ "name" ] + "', its ID is '" + response.data[ "id" ] + "'." );
		
		// Show error and response if it was not successful
		} else {
			console.error( "Failed to register command '/" + command[ "name" ] + "'!", response.status, response.data );
		}
	} );

}

// Register the status command
registerCommand( {
	"name": "status",
	"description": "Quickly check if the community services & servers are available."
} );



