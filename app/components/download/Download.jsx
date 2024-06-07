"use client";
import React from 'react';
import Image from 'next/image';
import GooglePlay from '../../assets/googleButton.png';
import AppStore from '../../assets/appStoreButton.png';
import DownloadPng from '../../assets/downloadImg.png';

const Download = () => {
  return (
    <div 
      className='lg:grid grid-cols-2 download'
      style={{
        height: 'auto',
        backgroundColor: '#0F0F0F'
      }}
    >
      <div 
        className="gridContent flex items-center flex-col justify-center p-4"
        data-aos="fade-out"
      >
        <h1 className='lg:text-6xl text-white font-bold text-3xl'>
          Download Vilox <br className='hidden lg:block' /> App 
        </h1>
        <div className="ml-0 pl-0 buttonDivs flex my-10 space-x-6 items-center">
          <a href="">
            <Image src={GooglePlay} alt="Google Play Download" />
          </a>
          <a href="">
            <Image src={AppStore} alt="App Store Download" />
          </a>
        </div>
      </div>
      <div 
        className="gridContent"
        data-aos="zoom-in"
      >
        <Image src={DownloadPng} alt="Download Image" />
      </div>
    </div>
  );
}

export default Download;
