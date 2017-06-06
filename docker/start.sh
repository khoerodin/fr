#!/usr/bin/env bash
set -e

for name in NGINX_WEBROOT
do
    eval value=\$$name
    sed -i "s|\${${name}}|${value}|g" /etc/nginx/conf.d/default.conf
done

if [ "$SYMFONY_ENV" = 'prod' ]; then
	composer install --prefer-dist --no-dev --no-progress --no-suggest --optimize-autoloader --classmap-authoritative
else
	composer install --prefer-dist --no-progress --no-suggest --optimize-autoloader --classmap-authoritative
fi

chmod 777 -R var/

for name in BACKEND_PORT BACKEND_HOST
do
    eval value=\$$name
    sed -i "s|\${${name}}|${value}|g" /etc/varnish/default.vcl
done

/usr/bin/supervisord -n -c /etc/supervisord.conf
