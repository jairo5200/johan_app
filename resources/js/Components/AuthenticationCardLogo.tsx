import { Link } from '@inertiajs/react';
import React from 'react';
import Logo from '../../../public/img/logoPrueba.png'
import 'animate.css';

export default function AuthenticationCardLogo() {
  return (
      <img
        className="w-64 h-64 animate__animated animate__backInDown"
        src={Logo}
      >
      </img>
    
  );
}