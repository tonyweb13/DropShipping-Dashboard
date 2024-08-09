# DropShipping Dashboard
### Setup
#### Prerequisites:

- PHP >= 8.0.16
- Mysql
- Mcrypt PHP Extension
- OpenSSL PHP Extension
- Mbstring PHP Extension
- Tokenizer PHP Extension

#### Steps:

1. Clone source into your system
2. Ask .env file to your co-workers
3. Run in terminal `npm install`
4. Run in terminal `composer install`
5. Run in terminal `php artisan migrate`
6. Run in terminal `php artisan db:seed --class=UserSeeder`

| Role | Credentials |
| ------ | ------ |
| Admin | UN: admin@email.com / PW: ******** |
| Client | UN: client@email.com / PW: ******** |

7. Run in terminal `npm run watch` and you can now start touching the files/codes
