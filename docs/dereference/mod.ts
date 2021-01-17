import { Application, Router, helpers } from "https://deno.land/x/oak/mod.ts";
const { getQuery } = helpers;

const router = new Router();

router
  .get("/", (context) => {
    context.response.body = "Hello world!";
  })
  .get("/did-modules/:did", async (context) => {
    const params = getQuery(context, { mergeParams: true });
    if (params.did) {
      context.response.body = "DID is required...";
    }
    const res = await fetch(
      `https://did-web.web.app/api/v1/identifiers/${params.did}`
    );
    const didDocument = await res.json();
    if (params.service && params.relativeRef) {
      const service = didDocument.service.find((s: any) => {
        return s.id === "#" + params.service;
      });
      const absoluteRef = service.serviceEndpoint + params.relativeRef;
      context.response.redirect(absoluteRef);
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Deno DID Dereferencer is running.");

console.log(
  "Example Module: http://localhost:8000/did-modules/did:web:or13.github.io:deno-did-pm?service=github&relativeRef=/OR13/deno-did-pm/master/docs/example-mod/mod.ts"
);

await app.listen({ port: 8000 });
