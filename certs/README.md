### This is where SSL certificate files should be located


### LetsEncrypt Renewal hook
- To automatically get renewed SSL certificates coped to the certs/ folder
- Add this to /etc/letsencrypt/renewal-hooks/deploy/10-ai-algoritme-nodejs
```
#!/bin/bash
domain=ai.algoritme.io
node_dir=/home/xuw/websites/ai.algoritme.io/certs
node_user=xuw
cp /etc/letsencrypt/live/$domain/{cert,privkey,chain}.pem "$node_dir"/
chown $node_user "$node_dir"/*.pem
```
