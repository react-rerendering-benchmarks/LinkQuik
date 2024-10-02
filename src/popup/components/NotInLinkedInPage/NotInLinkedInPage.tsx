import { memo } from "react";
import React from 'react';
export const NotInLinkedInPage = memo(() => {
  return <div className='mt-10 mx-4 flex flex-col items-center'>
            <img className='h-20' src="emoji_u1f97a.png" height={38} />
            <p data-testid="main-text" className='text-4xl text-center mt-7 font-[Podkova]'>This is not a LinkedIn search page</p>
        </div>;
});