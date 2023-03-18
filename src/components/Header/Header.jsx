import React,{useState} from 'react'
import { Sidebar } from 'primereact/sidebar'
import { Card } from 'primereact/card'
import { PanelMenu } from 'primereact/panelmenu'
import { Menubar } from 'primereact/menubar'
import logo from '../../images/crdt.png'
import header_brand from '../../images/header.jpg'
import { PrimeIcons } from 'primereact/api'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../Login/useAuth'
import CryptoJS from 'crypto-js';
import { Button } from 'primereact/button'

export default function Header() {

  const { logout, isAuthenticated, secret } = useAuth();

  const decrypt = () => {

    const virus = localStorage.getItem("virus");
    const decryptedData = CryptoJS.AES.decrypt(virus, secret);
    const dataString = decryptedData.toString(CryptoJS.enc.Utf8);
    const data = JSON.parse(dataString);

    return { data }
  }

  const navigate = useNavigate()
  const { pathname } = useLocation()
  const classactive = "menu-active"
  const [visibleLeft, setVisibleLeft] = useState(false);

  const items = [
    {
      label: 'Accueil',
      icon: PrimeIcons.HOME,
      className: pathname === "/acceuil" && classactive,
      command: () => {
        navigate("/acceuil");

      }
    },
    {
      label: 'Référentiels',
      icon: PrimeIcons.BOOKMARK,
      expanded: pathname === "/client" || pathname === "/patient" || pathname === "/prescripteur" || pathname === "/examen" ? true : false,
      items: [
        {
          label: 'Patient',
          icon: PrimeIcons.FILE,
          className: pathname === "/patient" && classactive,
          command: () => {
            navigate("/patient");

          }
        },
        {
          label: 'Client',
          icon: PrimeIcons.CREDIT_CARD,
          className: pathname === "/client" && classactive,
          command: () => {
            navigate("/client");

          }
        },
        {
          label: 'Prescripteur',
          icon: PrimeIcons.FILE,
          className: pathname === "/prescripteur" && classactive,
          command: () => {
            navigate("/prescripteur");

          }
        },
        {
          label: 'Examen',
          icon: PrimeIcons.FILE,
          className: pathname === "/examen" && classactive,
          command: () => {
            navigate("/examen");

          }
        }
      ]
    },
    {
      label: 'Patient du jour',
      icon: PrimeIcons.BOOK,
      className: pathname === "/patient_jour" && classactive,
      command: () => {
        navigate("/patient_jour");

      }
    },
    {
      label: 'Examen du jour',
      icon: PrimeIcons.USERS,
      className: pathname === "/examen_jour" && classactive,
      command: () => {
        navigate("/examen_jour");

      }
    },
    {
      label: 'Facture',
      icon: PrimeIcons.CREDIT_CARD,
      className: pathname === "/facture" && classactive,
      command: () => {
        navigate("/facture");

      }
    },

    {
      label: 'Rapport',
      icon: PrimeIcons.TABLE,
      expanded: pathname === "/facture_jour" || pathname === "/recette_jour" || pathname === "/virement_jour"
        || pathname === "/stat_examen" || pathname === "/stat_client" || pathname === "/stat_detail_examen" || pathname === "/stat_prescripteur" ||
        pathname === "/stat_categorie" || pathname === "/cumul_chiffre_affaire" || pathname === "/releve_facture" || pathname === "/rapport_examen_jour" || pathname === "/journal_jour" ? true : false,
      items: [
        {
          label: 'Journal du jour',
          icon: PrimeIcons.FILE,
          className: pathname === "/journal_jour" && classactive,
          command: () => {
            navigate("/journal_jour");

          }
        },
        {
          label: 'Examen du jour',
          icon: PrimeIcons.FILE,
          className: pathname === "/rapport_examen_jour" && classactive,
          command: () => {
            navigate("/rapport_examen_jour");

          }
        },
        {
          label: 'Facture du jour',
          icon: PrimeIcons.FILE,
          className: pathname === "/facture_jour" && classactive,
          command: () => {
            navigate("/facture_jour");

          }
        },
        {
          label: 'Recette du jour',
          icon: PrimeIcons.FILE,
          className: pathname === "/recette_jour" && classactive,
          command: () => {
            navigate("/recette_jour");

          }
        },
        {
          label: 'Virement du jour',
          icon: PrimeIcons.FILE,
          className: pathname === "/virement_jour" && classactive,
          command: () => {
            navigate("/virement_jour");

          }
        },
        {
          label: 'Stat Examen',
          icon: PrimeIcons.FILE,
          className: pathname === "/stat_examen" && classactive,
          command: () => {
            navigate("/stat_examen");

          }
        },
        {
          label: 'Stat Client',
          icon: PrimeIcons.FILE,
          className: pathname === "/stat_client" && classactive,
          command: () => {
            navigate("/stat_client");

          }
        },
        {
          label: 'Stat Détaillé Examen',
          icon: PrimeIcons.FILE,
          className: pathname === "/stat_detail_examen" && classactive,
          command: () => {
            navigate("/stat_detail_examen");

          }
        },
        {
          label: 'Stat Prescripteur',
          icon: PrimeIcons.FILE,
          className: pathname === "/stat_prescripteur" && classactive,
          command: () => {
            navigate("/stat_prescripteur");

          }
        },
        {
          label: 'Stat Catégorie',
          icon: PrimeIcons.FILE,
          className: pathname === "/stat_categorie" && classactive,
          command: () => {
            navigate("/stat_categorie");

          }
        },
        {
          label: 'Cumul C.A',
          icon: PrimeIcons.FILE,
          className: pathname === "/cumul_chiffre_affaire" && classactive,
          command: () => {
            navigate("/cumul_chiffre_affaire");

          }
        },
        {
          label: 'Rélévé Facture',
          icon: PrimeIcons.FILE,
          className: pathname === "/releve_facture" && classactive,
          command: () => {
            navigate("/releve_facture");

          }
        },
      ]
    },
    {
      label: 'Reglement',
      icon: PrimeIcons.COG,
      className: pathname === "/saisie_reglement" && classactive,
      command: () => {
        navigate("/saisie_reglement");

      }
    },
    {
      label: 'Modele CR',
      icon: PrimeIcons.USERS,
      className: pathname === "/modele_cr" && classactive,
      command: () => {
        navigate("/modele_cr");

      }
    },
    {
      label: 'Test',
      icon: PrimeIcons.USERS,
      className: pathname === "/test" && classactive,
      command: () => {
        navigate("/test");

      }
    }
  ];


  return (
    <>
     <div className='humbergeur' >
        {/* <h1 className='text-center my-0 text-lg pt-2'>Menu</h1> */}
        <Button icon={PrimeIcons.BARS} tooltip={'Menu'} onClick={() => setVisibleLeft(true)} className="ml-3 mt-3 p-button-sm p-button-secondary" />
      </div>

      <div className="lg:col-2 md:col-2 sm:col-3 col-3 p-0 mobile-m" style={{ minHeight: "88vh" }}>

        <Card className='h-full p-0 card-custom' style={{ position: 'relative' }}>
          <h1 className='text-center my-0 text-lg pt-2'>Menu</h1>
          <PanelMenu model={items} className="bg-white w-full pt-2" />
          <div style={{ position: 'absolute', bottom: '10px',borderTop:'1px solid grey',width:'100%' }} >
            {isAuthenticated ?
              <>
                <h4 className='m-2'> <>Nom :</>  {decrypt().data.nom} </h4>
                <h4 className='m-2'> <>Rôle  :</>  {decrypt().data.login} </h4>
              </>
              :
              null}
          </div>
        </Card>
        <Sidebar visible={visibleLeft} onHide={() => setVisibleLeft(false)}>
          <h1 className='text-center my-0 text-lg pt-2'>Menu</h1>
          <Card className='h-full p-0 card-custom'  >
            <PanelMenu model={items} className="bg-white w-full pt-2 tamby-menu" />
          </Card>
        </Sidebar>
      </div>
    </>
  )
}
