<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-24
 * Time: 22:00
 */

namespace CodeManager\Service;


use Psr\Log\LoggerInterface;

abstract class BaseAbstractService {

    protected $logger;

    public function __construct(LoggerInterface $logger) {
        $this->logger = $logger;
    }

    public function log($content) : void {
        $this->logger->debug($content);
    }

    public function warn($content) : void {
        $this->logger->warning($content);
    }

}
