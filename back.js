const materias = []; // Armazena as matérias cadastradas
const faltas = []; // Armazena as faltas registradas

const containerFaltas = document.getElementById('containerFaltas'); // Substituído querySelector por getElementById

// Função para carregar os dados do localStorage
function carregarDados() {
    const materiasSalvas = JSON.parse(localStorage.getItem('materias'));
    const faltasSalvas = JSON.parse(localStorage.getItem('faltas'));

    if (materiasSalvas) {
        materias.push(...materiasSalvas);
    }
    if (faltasSalvas) {
        faltas.push(...faltasSalvas);
    }

    if (containerFaltas) {
        atualizarFaltas();
    }
}

// Função para salvar os dados no localStorage
function salvarDados() {
    localStorage.setItem('materias', JSON.stringify(materias));
    localStorage.setItem('faltas', JSON.stringify(faltas));
}

// Função para cadastrar uma matéria
function cadastrarMateria() {
    const nomeMateria = document.getElementById('materiaCadastro').value.trim(); 
    const nomeProfessor = document.getElementById('nomeProfessor').value.trim(); 
    const numeroSemestre = document.getElementById('numeroSemestre').value.trim(); 

    if (!nomeMateria || !nomeProfessor || !numeroSemestre) {
        alert('Preencha todos os campos para cadastrar a matéria.');
        return;
    }

    const materiaExistente = materias.find(materia => materia.nome === nomeMateria);
    if (materiaExistente) {
        alert('Matéria já cadastrada.');
        return;
    }

    materias.push({
        nome: nomeMateria,
        professor: nomeProfessor,
        semestre: numeroSemestre,
    });

    document.getElementById('materiaCadastro').value = ''; 
    document.getElementById('nomeProfessor').value = ''; 
    document.getElementById('numeroSemestre').value = ''; 

    alert('Matéria cadastrada com sucesso!');
    salvarDados();
    if (containerFaltas) {
        atualizarFaltas();
    }
}

// Função para adicionar faltas
function adicionarFalta() {
    const nomeMateria = document.getElementById('materiaFalta').value.trim(); 
    const diaFalta = document.getElementById('diaFalta').value.trim(); 
    const numeroFaltas = parseInt(document.getElementById('numeroFaltas').value.trim(), 10); 

    if (!nomeMateria || !diaFalta || isNaN(numeroFaltas)) {
        alert('Preencha todos os campos para adicionar faltas.');
        return;
    }

    const materiaExistente = materias.find(materia => materia.nome === nomeMateria);
    if (!materiaExistente) {
        alert('Matéria não encontrada. Cadastre a matéria antes de adicionar faltas.');
        return;
    }

    const falta = faltas.find(f => f.materia === nomeMateria);
    if (falta) {
        falta.total += numeroFaltas;
    } else {
        faltas.push({
            materia: nomeMateria,
            data: diaFalta,
            total: numeroFaltas,
        });
    }

    document.getElementById('materiaFalta').value = ''; 
    document.getElementById('diaFalta').value = ''; 
    document.getElementById('numeroFaltas').value = ''; 

    alert('Faltas adicionadas com sucesso!');
    salvarDados();
    if (containerFaltas) {
        atualizarFaltas();
    }
}

// Função para atualizar a seção de faltas NÃO ENCONSTAR NESSE CARALHO
function atualizarFaltas() {
    if (!containerFaltas) return;

    containerFaltas.innerHTML = ''; 

    materias.forEach(materia => {
        const falta = faltas.find(f => f.materia === materia.nome);
        const totalFaltas = falta ? falta.total : 0;

        const box = document.createElement('div');
        box.classList.add('box');
        box.innerHTML = `
            <h4>${materia.nome}</h4>
            <hr>
            <p>Semestre <h4>${materia.semestre}</h4></p>
            <hr>
            <p>Prof° ${materia.professor}</p>
            <hr>
            <h4>${totalFaltas} falta(s)</h4>
            <button class="deletar-materia" onclick="deletarMateria('${materia.nome}')"><img src="IMG/icons8-delete.svg"></button>
        `;

        containerFaltas.appendChild(box); 
    });
}

// Função para deletar uma matéria
function deletarMateria(nomeMateria) {
    const indexMateria = materias.findIndex(materia => materia.nome === nomeMateria);
    if (indexMateria === -1) {
        alert('Matéria não encontrada.');
        return;
    }

    // Deletar a matéria e as faltas relacionadas
    materias.splice(indexMateria, 1);

    // Deletar as faltas associadas à matéria
    const indexFalta = faltas.findIndex(falta => falta.materia === nomeMateria);
    if (indexFalta !== -1) {
        faltas.splice(indexFalta, 1);
    }

    // Salvar no localStorage
    salvarDados();
    alert('Matéria e faltas deletadas com sucesso!');
    
    // Atualizar a interface
    if (containerFaltas) {
        atualizarFaltas();
    }
}

// Adicionando event listeners aos botões
document.getElementById('botaoCadastrarMateria').addEventListener('click', cadastrarMateria); 
document.getElementById('botaoAdicionarFalta').addEventListener('click', adicionarFalta); 

// Carregar os dados ao carregar a página
window.onload = carregarDados;
