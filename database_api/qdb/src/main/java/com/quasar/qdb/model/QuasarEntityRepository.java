package com.quasar.qdb.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuasarEntityRepository extends JpaRepository<QuasarEntity, Long> {
    Optional<QuasarEntity> findByName(QuasarEntity name);
}
