import About from "./section/about/About"
import { Block } from "./section/block/Block"
import Contacts from "./section/contacts/Contacts"
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
      <Contacts/>
    </>
  )
}

export default HomePage