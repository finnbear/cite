git pull
fuser -k 7778/tcp
rm nohup.out
nohup nodejs bin/www &
