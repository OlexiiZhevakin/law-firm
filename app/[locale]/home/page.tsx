import About from "./section/about/About"
import { Block } from "./section/block/Block"
import Head from "./section/head/Head"
import Partner from "./section/partner/Partner"
import Services from "./section/services/Services"



const HomePage = () => {
  return (
    <>
      <Head />
      <About/>
      <Block/>
      <Partner/>
      <Services />
    </>
  )
}

export default HomePage