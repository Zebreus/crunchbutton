FROM php:7.0.20-fpm

ENV DOCKER=1

EXPOSE 80

RUN apt-get update && apt-get install -y \
        libmcrypt-dev \
        php-pear \
        curl \
        git \
		nginx \
		zlib1g-dev \
    && docker-php-ext-install iconv mcrypt \
	&& docker-php-ext-install pdo pdo_mysql \
	&& docker-php-ext-install mbstring \
	&& docker-php-ext-install zip

# https://github.com/docker-library/php/issues/262#issuecomment-233109231
# RUN docker-php-source extract \
#     && curl -L -o /tmp/redis.tar.gz https://github.com/phpredis/phpredis/archive/3.0.0.tar.gz \
#     && tar xfz /tmp/redis.tar.gz \
#     && rm -r /tmp/redis.tar.gz \
#     && mv phpredis-3.0.0 /usr/src/php/ext/redis \
#     && sed -i '$ a redis' /usr/src/php-available-exts \
#     && docker-php-ext-install redis # \
#     && docker-php-source delete

ADD conf/fpm.conf /usr/local/etc/php-fpm.d/www.conf
ADD conf/nginx.docker.conf /etc/nginx/sites-available/default
RUN echo "cgi.fix_pathinfo = 0;" >> /usr/local/etc/php/conf.d/fix_pathinfo.ini
#RUN echo "listen = /var/run/php5-fpm.sock" >> /usr/local/etc/php-fpm.conf
RUN echo " \n\
listen = 127.0.0.1:9000" >> /usr/local/etc/php-fpm.conf

RUN version=$(php -r "echo PHP_MAJOR_VERSION.PHP_MINOR_VERSION;") \
    && curl -A "Docker" -o /tmp/blackfire-probe.tar.gz -D - -L -s https://blackfire.io/api/v1/releases/probe/php/linux/amd64/$version \
    && tar zxpf /tmp/blackfire-probe.tar.gz -C /tmp \
    && mv /tmp/blackfire-*.so $(php -r "echo ini_get('extension_dir');")/blackfire.so \
    && printf "extension=blackfire.so\nblackfire.agent_socket=tcp://blackfire:8707\n" > $PHP_INI_DIR/conf.d/blackfire.ini

ADD ./ /app
RUN php --ini
RUN cd /app && curl -sS https://getcomposer.org/installer | php
RUN cd /app && php composer.phar install --no-dev --optimize-autoloader --prefer-dist


#RUN mkdir /app/cache/data && chmod 0777 /app/cache/data
#RUN mkdir /app/cache/min && chmod 0777 /app/cache/min
RUN mkdir /tmp/data && chmod 0777 /tmp/data
RUN mkdir /tmp/min && chmod 0777 /tmp/min

# twilio ssl fix
#ADD ssl/twilio.der.crt /usr/local/share/ca-certificates/twilio.der.crt
#RUN chmod 0644 /usr/local/share/ca-certificates/twilio.der.crt
#RUN chown root.root /usr/local/share/ca-certificates/twilio.der.crt
#RUN /usr/sbin/update-ca-certificates

CMD sleep 20 && /app/cli/build.sh && nginx && php-fpm