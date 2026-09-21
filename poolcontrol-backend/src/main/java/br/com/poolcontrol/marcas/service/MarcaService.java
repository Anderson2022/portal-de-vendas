package br.com.poolcontrol.marcas.service;

import br.com.poolcontrol.marcas.entity.Marca;
import br.com.poolcontrol.marcas.repository.MarcaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarcaService {

    private final MarcaRepository marcaRepository;

    public MarcaService(MarcaRepository marcaRepository) {
        this.marcaRepository = marcaRepository;
    }

    public Marca salvar(Marca marca) {

        if (marcaRepository.existsByEmpresaIdAndNomeIgnoreCase(
                marca.getEmpresaId(),
                marca.getNome())) {

            throw new RuntimeException(
                    "Marca já cadastrada para esta empresa."
            );
        }

        if (marca.getAtivo() == null) {
            marca.setAtivo(true);
        }

        return marcaRepository.save(marca);
    }

    public List<Marca> listarPorEmpresa(Long empresaId) {

        return marcaRepository
                .findByEmpresaIdAndAtivoTrue(empresaId);
    }

    public Marca buscarPorId(Long id, Long empresaId) {

        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Marca não encontrada.")
                );

        if (!marca.getEmpresaId().equals(empresaId)) {
            throw new RuntimeException(
                    "Marca não pertence a esta empresa."
            );
        }

        return marca;
    }

    public Marca atualizar(Long id, Marca dados) {

        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Marca não encontrada.")
                );


        if (dados.getEmpresaId() != null &&
                !marca.getEmpresaId().equals(dados.getEmpresaId())) {

            throw new RuntimeException(
                    "Não é permitido alterar a empresa da marca."
            );
        }

        /*
         * Verifica duplicidade somente se o nome foi alterado.
         */
        if (dados.getNome() != null &&
                !marca.getNome().equalsIgnoreCase(dados.getNome())) {

            boolean nomeExiste =
                    marcaRepository.existsByEmpresaIdAndNomeIgnoreCase(
                            marca.getEmpresaId(),
                            dados.getNome()
                    );

            if (nomeExiste) {
                throw new RuntimeException(
                        "Já existe uma marca com este nome para esta empresa."
                );
            }

            marca.setNome(dados.getNome());
        }

        if (dados.getCodigo() != null) {
            marca.setCodigo(dados.getCodigo());
        }

        if (dados.getNomeReduzido() != null) {
            marca.setNomeReduzido(dados.getNomeReduzido());
        }

        if (dados.getDescricao() != null) {
            marca.setDescricao(dados.getDescricao());
        }

        if (dados.getEnderecoId() != null) {
            marca.setEnderecoId(dados.getEnderecoId());
        }

        if (dados.getLogoUrl() != null) {
            marca.setLogoUrl(dados.getLogoUrl());
        }

        if (dados.getSite() != null) {
            marca.setSite(dados.getSite());
        }

        if (dados.getContato() != null) {
            marca.setContato(dados.getContato());
        }

        if (dados.getCodigoExterno() != null) {
            marca.setCodigoExterno(dados.getCodigoExterno());
        }

        if (dados.getObservacoes() != null) {
            marca.setObservacoes(dados.getObservacoes());
        }

        if (dados.getAtivo() != null) {
            marca.setAtivo(dados.getAtivo());
        }

        return marcaRepository.save(marca);
    }

    public void alterarStatus(Long id, boolean ativo) {

        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Marca não encontrada.")
                );

        marca.setAtivo(ativo);

        marcaRepository.save(marca);
    }
}
