FROM php:8.4-fpm-alpine

RUN apk add --no-cache libpng-dev libzip-dev zip unzip postgresql-dev redis $PHPIZE_DEPS
RUN docker-php-ext-install pdo pdo_pgsql zip
RUN pecl install pcov && docker-php-ext-enable pcov

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
