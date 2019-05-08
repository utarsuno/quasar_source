<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository;
use CodeManager\Entity\EntityNPMLibrary;
use QuasarSource\Utilities\DateTimeUtilities            as TIME;
use QuasarSource\Utilities\Files\PathUtilities          as PATH;
use QuasarSource\Utilities\Processes\ProcessNPMCommands as NPM;


class EntityNPMLibraryRepository extends AbstractRepository {

    public function get_lib_by_name(string $lib_name) : ?EntityNPMLibrary {
        return $this->findOneBy(['name' => $lib_name]);
    }

    public function create_npm_library_from_name(string $lib_name) : EntityNPMLibrary {
        $latest_version  = NPM::get_latest_version($lib_name);
        PATH::cwd_push('/quasar_source/applications/asset_server/js');
        $current_version = NPM::get_version_local($lib_name);
        PATH::cwd_pop();
        $lib = new EntityNPMLibrary();
        $lib->setName($lib_name);
        $lib->setLastChecked(TIME::now());
        $lib->setVersionLocal($current_version);
        $lib->setVersionLatest($latest_version);

        $this->save_entity($lib, true);
        return $lib;
    }

    public function check_version_latest(EntityNPMLibrary $entity) : void {
        $latest_version = NPM::get_latest_version($entity->getName());
        if ($latest_version !== $entity->getVersionLatest()) {
            $entity->setVersionLatest($latest_version);
            $entity->setLastChecked(TIME::now());
            $this->save_entity($entity, true);
        }
    }

    protected function event_before_remove_entity($entity): void {}

    protected function event_after_remove_entity($entity): void {}
}
