<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository;

use CodeManager\Entity\EntityFile;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Mapping;
use QuasarSource\Utilities\FileUtilities;

class EntityFileRepository extends EntityRepository {

    public function get_all_file_temp_test() {
        #return $this->getEntityManager()->createQuery('SELECT * FROM CodeManager:EntityFile f')->getResult();
        return $this->findAll();
    }

    public function has_file_by_name(string $file_name) : bool {
        $name      = FileUtilities::path_get_file_name($file_name);
        $extension = FileUtilities::path_get_ending_extension($file_name);
        $result    = $this->findOneBy(
            [
                'name'      => $name,
                'extension' => $extension
            ]
        );
        if ($result === null) {
            return false;
        }
        return true;
    }

    public function get_file_by_name(string $file_name) : ?EntityFile {
        $name      = FileUtilities::path_get_file_name($file_name);
        $extension = FileUtilities::path_get_ending_extension($file_name);
        $result    = $this->findOneBy(
            [
                'name'      => $name,
                'extension' => $extension
            ]
        );
        if ($result !== null) {
            return $result;
        }
        return null;
    }

    public function cache_file(string $file_path) : void {
        if ($this->has_file_by_name($file_path)) {
            return;
        }

        $name      = FileUtilities::path_get_file_name($file_path);
        $extension = FileUtilities::path_get_ending_extension($file_path);

        $current_date_time = new DateTime('now');

        $file = new EntityFile();
        $file->setName($name)
            ->setExtension($extension)
            ->setFullPath($file_path)
            ->setFirstCached($current_date_time)
            ->setLastCached($current_date_time)
            ->setSha512sum(FileUtilities::file_get_sha512sum($file_path))
            ->setSizeInBytes(FileUtilities::file_get_size($file_path))
            // Temporary
            ->setFileType(0);

        $this->_em->persist($file);
        $this->_em->flush();
    }

}
