<?php declare(strict_types=1);
require dirname(__DIR__).'/vendor/autoload.php';
# ----------------------------------- {A U T O   G E N E R A T E D   C O D E}:{0x0} ------------------------------------
$_ENV += [
	'APP_ENV'                     => 'dev',
	'KERNEL_CLASS'                => 'CodeManager\Kernel',
	'APP_SECRET'                  => 's$cretf0rt3st',
	'SYMFONY_DEPRECATIONS_HELPER' => '999999',
	'YES'                         => 'HELLO!',
];
# --------------------------------------------------- {E N D}:{0x0} ----------------------------------------------------
$_SERVER += $_ENV;
$_SERVER['APP_ENV']   = $_ENV['APP_ENV'] = ($_SERVER['APP_ENV'] ?? $_ENV['APP_ENV'] ?? null) ?: 'dev';
$_SERVER['APP_DEBUG'] = $_SERVER['APP_DEBUG'] ?? $_ENV['APP_DEBUG'] ?? 'prod' !== $_SERVER['APP_ENV'];
$_SERVER['APP_DEBUG'] = $_ENV['APP_DEBUG'] = (int) $_SERVER['APP_DEBUG'] || filter_var($_SERVER['APP_DEBUG'], FILTER_VALIDATE_BOOLEAN) ? '1' : '0';
