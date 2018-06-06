package com.quasar.qdb.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "stores")
@XmlRootElement(name = "store")
@XmlAccessorType(XmlAccessType.NONE)
public class QuasarEntity {
    public QuasarEntity() {

    }

    public QuasarEntity(Long id, String name, String description, Boolean allowMultiple) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("QuasarEntity{");
        sb.append("id=").append(id);
        sb.append(", name='").append(name).append("\'");
        sb.append("}");
        return sb.toString();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Id
    @XmlElement
    private Long id;

    @XmlElement
    @Column(nullable = false, length = 64)
    private String name;

    @Column(nullable = false, length = 256)
    private String description;

    @ManyToOne
    @Column(nullable = false)
    private User owner;

    @ManyToOne
    @Column(nullable = true)
    private QuasarEntity parent;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="parent")
    @JsonIgnore
    private Collection<QuasarEntity> children;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public QuasarEntity getParent() {
        return parent;
    }

    public void setParent(QuasarEntity parent) {
        this.parent = parent;
    }

    public Collection<QuasarEntity> getChildren() {
        return children;
    }

    public void setChildren(Collection<QuasarEntity> children) {
        this.children = children;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }
}
