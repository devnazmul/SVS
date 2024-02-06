// ===========================================
// #00150
// ===========================================
import React from 'react'

export default function CustomMiniLoading({customClasses,loaderColor="text-primary"}) {
  return (
    <div className={`${customClasses} flex justify-center items-center`}>
      <span className={`loading loading-spinner ${loaderColor} loading-lg`}></span>
    </div>
  )
}
