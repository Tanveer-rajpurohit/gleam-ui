"use client"

import { useParams } from "next/navigation"


const Page = () => {
    const params = useParams()
    const slug = params?.slug

  return (
    <div className="w-full realtive">
        

        {/* render the demo */}

    </div>
  )
}
export default Page