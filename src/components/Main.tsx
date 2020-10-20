import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import api from '../services/api';

import '../assets/css/components/main.css';
import UserView from './User';

interface User {
  userId: number,
  nodeId: string,
  html_url: string,
  avatar_url: string,
  login: string,
  followers: number,
  following: number,  
  deleted: boolean
}

function Main() {
  const [list, setList] = useState<User[]>();
  const [perPage] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [showDeleteds, setShowDeleteds] = useState<boolean>(false);
  
  useEffect(() => {    
    api.get(`users?per_page=${perPage}`)
      .then((response) => {
        const newList = response.data.map((ele:any) => (
          { 
            userId: ele.id,
            nodeId: ele.node_id,
            html_url: ele.html_url,
            avatar_url: ele.avatar_url,
            login: ele.login,
            followers: ele.followers,
            following: ele.following,
            deleted: false            
          }))
        localStorage.setItem('users', JSON.stringify(newList));
        setList(newList);
      })
      .catch((error) => {
        alert("Ocorreu um erro ao buscar os items");
      });
  },[perPage]);

  useEffect(() => {
    const users:User[] = JSON.parse(localStorage.getItem('users') || ''); 
    const result = users!.filter((ele) =>  ele.login.indexOf(search) >= 0 || ele.userId.toString().indexOf(search) >= 0 || search === '' );
    setList(result);
  },[search]);

  if(!list){
    return <h1>Loading...</h1>
  }

  async function handleDelete(evt: React.MouseEvent, index: number) {
    evt.preventDefault();
    const MySwal = withReactContent(Swal);
    const res = await MySwal.fire({
      title: 'Você tem certeza?',
      text: "Tem certeza que deseja deletar o usuário da lista!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sim, delete!'
    });
    if (res.isConfirmed) {
      const users:User[] = JSON.parse(localStorage.getItem('users') || ''); 
      const newList:User[] = Object.assign([],users);
      const element = {...newList![index], deleted: true};

      newList!.splice(index,1,element);  
      localStorage.setItem('users', JSON.stringify(newList)); 
      setList(newList);
      MySwal.fire('Sucesso!',
        'Usuário deletado com sucesso!',
        'success');
    }    
  }
  return (
    <div className="main">
      <h1 className="title">Listagem 10 usuários do GitHub</h1>
      <ul className="list">
        <li className="item-list item-search">
          <label className="search-input" htmlFor="search">
            Localizar Usuário: 
            <input type="text" id="search" name="search" value={search} onChange={(evt) => setSearch(evt.target.value)}/>
          </label>
          {
            !showDeleteds ?
              <input className="button-red" type="button" onClick={() => setShowDeleteds(!showDeleteds)} value="Visualizar Deletados"/>
            :
              <input className="button-green" type="button" onClick={() => setShowDeleteds(!showDeleteds)} value="Visualizar Não Deletados"/>
          }
        </li>
      {
        list?.map((item,index) => (
          <div key={item.userId}>
            {
              item.deleted === showDeleteds ?
              <li className="item-list">
                <UserView user={item} index={index} handleDelete={handleDelete}/>
              </li>
              : null
            }
          </div>
          ))
        }
      </ul>
    </div>
  );
}

export default Main;
