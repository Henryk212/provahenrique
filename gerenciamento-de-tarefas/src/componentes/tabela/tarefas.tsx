import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ITarefas } from "../../models/ITarefas";

export default function Tarefas() {
    const [tarefas, setTarefas] = useState<ITarefas[]>([]);
    const [categoria, setCategoria] = useState<string>("");
    const [titulo, setTitulo] = useState<string>("");
    const [descricao, setDescricao] = useState<string>("");
    

    useEffect(() => {
        carregarTarefas();
    }, []);



    function carregarTarefas() {
        fetch("http://localhost:5000/tarefas/listar")
          .then((resposta) => resposta.json())
          .then((tarefas: ITarefas[]) => {
            setTarefas(tarefas);
            console.table(tarefas);
          })
          .catch((erro) => {
            console.log("Deu erro!");
          });
      }

      function cadastrar(event: any) {
        event.preventDefault();
        let titulo = event.target.titulo.value;
        let descricao = event.target.descricao.value;
        let categoria = event.target.categoria.value;
        fetch("http://localhost:5000/tarefas/cadastrar", {
          method: "POST",
          body: JSON.stringify({
            titulo: titulo,
            descricao: descricao,
            categoriaId: categoria,
          }),
          headers: {
            "Content-type": "application/json",
          },
        })
          .then((resposta) => resposta.json())
          .then((resposta) => {
            console.log(resposta);
            carregarTarefas();
          })
          .catch((erro) => console.log(erro));
      }

      function alterarStatus(tarefaId: string) {
        fetch(`http://localhost:5000/tarefa/alterar/${tarefaId}`, {
          method: "PUT",
        })
          .then((resposta) => resposta.json())
          .then((resposta) => {
            console.log(resposta);
            carregarTarefas();
          })
          .catch((erro) => console.log(erro));
      }

      function listarConcluidas(){
        fetch(`http://localhost:5000/tarefas/concluidas`)
        .then((resposta) => resposta.json())
        .then((resposta) => {
            if(resposta.length === 0){
                alert('Não há tarefas concluídas');
                carregarTarefas();
            }else{
                setTarefas(resposta);
            }
        })
        .catch((erro) => console.log(erro));
      }

     function listarNaoIniciadas(){
        fetch(`http://localhost:5000/tarefas/naoconcluidas`)
        .then((resposta) => resposta.json())
        .then((resposta) => {
            if(resposta.length === 0){
                alert('Não há tarefas não iniciadas');
                carregarTarefas();
            }else{
                setTarefas(resposta);
            }
        })
        .catch((erro) => console.log(erro));
     }



    return (
        <div className="">
            <div>
                <h1>Listar de tarefas</h1>
                <table style={{ borderCollapse: 'collapse' }}>
                    <thead>
                        <tr className="p-4">
                            <th className="mr-2">#</th>
                            <th>Titulo</th>
                            <th>Desrição</th>
                            <th>Criada em</th>
                            <th>Categoria</th>
                            <th>categoria ID</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tarefas.map((tarefa) => (
                                <tr key={tarefa.tarefaId}>
                                    <td>{tarefa.tarefaId}</td>
                                    <td>{tarefa.titulo}</td>
                                    <td>{tarefa.descricao}</td>
                                    <td>{tarefa.criadaEm}</td>
                                    <td>{tarefa.categoria}</td>
                                    <td>{tarefa.categoriaId}</td>
                                    <td>{tarefa.status}</td>
                                    <td>
                                        <button onClick={() => alterarStatus(tarefa.tarefaId!)}>
                                            Alterar status
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => listarConcluidas()}>
                                            Concluidas
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => listarNaoIniciadas()}>
                                            Não iniciadas
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <h1>Cadastrar Tarefas</h1>
            <form onSubmit={cadastrar}>
                <label htmlFor="titulo">Titulo</label>
                <input type="text" onChange={(e: any) => setTitulo(e.target.value)} name="titulo" id="titulo" />

                <label htmlFor="descricao">Descrição</label>
                <input type="text" onChange={(e: any) => setDescricao(e.target.value)} name="descricao" id="descricao" />

                <label htmlFor="categoria">CategoriaID</label>
                <input type="text" onChange={(e: any) => setCategoria(e.target.value)} name="categoria" id="categoria" />

                <button type="submit">Cadastrar</button>
            </form>
        </div>
    )
}