//INCLUDE THIS IN HTML

// <script
// src="https://unpkg.com/graphql-ws/umd/graphql-ws.min.js"
// type="application/javascript"
//     ></script>

let wsClient = null;

const disconnectSubscription=()=>{
    wsClient?.dispose();
    return true;
}

const createSubscription=async (query,auth_token)=>{

    wsClient = graphqlWs.createClient({
        url: "ws://localhost:3002/graphql",
        connectionParams:{
            auth_token
        },
        lazy:false
    });

    wsClient.on('connecting',()=>{
        console.log('connecting subscription')
    })

    wsClient.on('connected',async ()=>{
        console.log('subscription connected');

        //Callback to godot to inform about socket connected;

        const subscription = wsClient.iterate({
            query,
        });

        for await (const event of subscription) {
            //Callback to godot for sending data
            console.log(event);

        }
    })

    wsClient.on('error',(err)=>{
        console.log('error in subscription',err);
    })

    wsClient.on('closed',()=>{
        //callback to godot to inform disconnection if needed

        disconnectSubscription()
    })
}