package br.com.poolcontrol.user.repository;



import br.com.poolcontrol.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByIdAndCompanyId(Long id, Long companyId);
    List<User> findAllByCompanyIdOrderByNameAsc(Long companyId);
    boolean existsByEmailIgnoreCase(String email);
}
