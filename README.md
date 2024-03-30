## Description
This project is built to somehow snapshot the state of a website and it focuses on three things:
1. Websites main page
2. intodns status (to check the nameservers)
3. check-host (the IP of the server)



## PM2 Process Management Quick Start
My ideal is to use [pm2](https://pm2.keymetrics.io/) package to keep the code running 24/7 but for the time being the implementation uses node cluster and forks itself on exit and error.
