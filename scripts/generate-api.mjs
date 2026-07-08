import { writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const openapiUrl = process.env.OPENAPI_URL || 'http://localhost:8080/api-docs';

const response = await fetch(openapiUrl);
if (!response.ok) {
    throw new Error(`Impossible de récupérer OpenAPI (${response.status}) : ${openapiUrl}`);
}

writeFileSync('openapi.json', await response.text());
console.log(`OpenAPI téléchargé depuis ${openapiUrl}`);

execSync(
    'npx openapi-typescript-codegen --input openapi.json --output src/lib --client fetch',
    { stdio: 'inherit' },
);

console.log('Client régénéré dans src/lib/');
