package br.com.poolcontrol.marcas.repository;

import br.com.poolcontrol.marcas.entity.Marca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarcaRepository extends JpaRepository<Marca, Long> {

    List<Marca> findByEmpresaIdAndAtivoTrue(Long empresaId);

    boolean existsByEmpresaIdAndNomeIgnoreCase(
            Long empresaId,
            String nome
    );

    Optional<Marca> findByIdAndEmpresaId(
            Long id,
            Long empresaId
    );


}