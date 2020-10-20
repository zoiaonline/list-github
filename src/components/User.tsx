import React, { useEffect, useState }  from 'react';

import { FiGithub, FiX } from 'react-icons/fi';

import '../assets/css/components/user.css';
import api from '../services/api';

interface User {
  userId: number,
  nodeId: string,
  html_url: string,
  avatar_url: string,
  login: string,
  deleted: boolean
}

interface UserProps {
  user: User,
  index: number,
  handleDelete(evt: React.MouseEvent, index: number): any,
}

const User: React.FC<UserProps> = ({user, index, handleDelete, children}) => { 
  const [userFollowers, setUserFollowers] = useState(0);
  const [userFollowing, setUserFollowing] = useState(0);
  useEffect(() => {
    api.get(`users/${user.login}`)
      .then((response) => {
        const {followers, following } = response.data;  
        setUserFollowers(followers);
        setUserFollowing(following);
      })
      .catch((error) => {
        alert("Ocorreu um erro ao buscar os items");
      });
  },[user])
  return (
    <div className="user">
      <img src={user.avatar_url} alt={user.login}/>
      <div>
        <span><strong>Login:</strong> {user.login}</span>
        <span><strong>Node Id:</strong> {user.nodeId}</span>
        <span><strong>User Id:</strong> {user.userId}</span>
        <span><strong>Followers:</strong> {userFollowers}</span>
        <span><strong>Following:</strong> {userFollowing}</span>
        <div>
          <a href={`https://github.com/${user.login}`} target="_blank" rel="noopener noreferrer"><FiGithub size={24} color="#24292E"/> Abrir página GitHub</a>
          {
            user.deleted ?
              <FiX className="delete-user" size={24} color="gray" title="Usuário Deletado da Lista."/>
              :
              <FiX className="delete-user" size={24} color="#FE6E6C" title="Delatar Usuário da Lista." onClick={(e) => handleDelete(e,index)}/>               
          }
        </div>
      </div>
    </div>
  );
}

export default User;
