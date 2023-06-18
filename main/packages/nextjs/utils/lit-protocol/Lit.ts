import * as Lit from "@lit-protocol/lit-node-client";

const litClient = new Lit.LitNodeClient({ debug: true });

litClient.connect();

export default litClient;
