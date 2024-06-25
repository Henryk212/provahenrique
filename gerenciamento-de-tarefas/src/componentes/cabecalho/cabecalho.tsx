import React from 'react';
import './cabecalho.css';

export default function Cabecalho() {
    return (
        <div className='container-fluid'>
            <div className='row flex'>
                <div className='col-12 flex justify-content-center p-3 bg-primary text-white'>
                    <h1 className="cabecalho">Gerenciador de tarefas</h1>
                    <a >Cadastar tarefa</a>
                </div>
            </div>
        </div>
        
    );
}