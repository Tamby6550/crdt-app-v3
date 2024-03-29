import React, { useState, useEffect, useRef } from 'react'
import BundledEditor from './service/EditorTiny/BundledEditor';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import ReactToPrint from 'react-to-print'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import CRmodel from './CRmodel';
import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox'


export default function InsertModel() {
    const [chargePost, setchargePost] = useState({ chajoute: false });

    const [oldfilename, setoldfilename] = useState(null)
    const [nomFichier, setnomFichier] = useState('')
    const [recHtml, setrecHtml] = useState(null);

    const [choixAjoutModif, setchoixAjoutModif] = useState(false)
    const [model, setmodel] = useState("<h3>Hello word !</h3>")
    /*Word */
    const editorRef = useRef(null);
    let reportTemplateRef = useRef();
    const [content, setContent] = useState(null)




    const toastTR = useRef(null);
    /*Notification Toast */
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 10000 });
    }
    /*Notification Toast */

    //fonction qui enleve le nom ficheir a partir de lien
    function getFileNameFromLink(link) {
        // Retourne le dernier segment du lien, sans l'extension .html
        return link.split('/').pop().replace('.html', '');
    }

    const log = () => {
        if (choixAjoutModif) {
            if (editorRef.current.getContent() == "") {
                notificationAction('warn', 'Attention !', 'Le compte Rendu est vide !')
            } else {
                if (editorRef.current) {
                    let strin = JSON.stringify({ data: editorRef.current.getContent() });
                    let pars = JSON.parse(strin);
                    var myElement = document.getElementById("print");
                    // myElement.innerHTML = editorRef.current.getContent();
                    console.log(editorRef.current.getContent())
                    envoyeData(pars.data,nomFichier)
                }
            }
        } else {
            if (nomFichier === '') {
                notificationAction('warn', 'Attention !', 'Le nom examen est vide !')
            } else {
                if (editorRef.current.getContent() == "") {
                    notificationAction('warn', 'Attention !', 'Le compte Rendu est vide !')
                } else {
                    if (editorRef.current) {
                        let strin = JSON.stringify({ data: editorRef.current.getContent() });
                        let pars = JSON.parse(strin);
                        var myElement = document.getElementById("print");
                        // myElement.innerHTML = editorRef.current.getContent();
                        console.log(editorRef.current.getContent())
                        envoyeData(pars.data,nomFichier)
                    }
                }
            }
        }
    };
    const visualier = () => {
        if (editorRef.current) {
            let strin = JSON.stringify({ data: editorRef.current.getContent() });
            let pars = JSON.parse(strin);
            var myElement = document.getElementById("print");
            myElement.innerHTML = editorRef.current.getContent();
            return document.getElementById("scann");
        }
    };
    /*Word */

    // useEffect(() => {
    //     if (editorRef.current) {
    //         var currentDate = new Date();
    //         // Formatage de la date au format souhaité (ici, jj/mm/aaaa)
    //         var formattedDate = currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear();

    //         // Remplacement de [DATE] par la date formatée
    //         var content = editorRef.current.getContent().replace('[DATE]', formattedDate);
    //         editorRef.current.setContent(content);
    //     }
    // }, [model])



    //Post Vers serveur node js
    const envoyeData = async (data,nomfile) => {
        setchargePost({ chajoute: true });
        try {
            await axios.post(`http://${window.location.hostname}:3354/api/savemodel/${nomfile}`, {
                headers: {
                    'Content-Type': 'text/html'
                },
                body: data
            }).then(
                (result) => {
                    notificationAction('success', 'Enregistrement Modele CR', 'Modèle CR bien enregistré !')
                    setchargePost({ chajoute: false });
                }
            )
                .catch((e) => {
                    console.log(e)
                    setchargePost({ chajoute: false });
                })
        } catch (error) {
            console.log(error)
        }
    }

    const getData = async () => {

        try {
            await axios.get(`http://${window.location.hostname}:3354/api/hello/${nomFichier}`, {
                headers: {
                    'Content-Type': 'text/html'
                }
            }).then(
                (result) => {
                    setrecHtml(result.data)
                    setTimeout(() => {
                        var myElement = document.getElementById("print");
                        myElement.innerHTML = editorRef.current.getContent();
                    }, 550)
                }
            )
                .catch((e) => {
                    console.log(e);

                    setrecHtml(null)
                })
        } catch (error) {
            console.log(error)
        }
    }

    function getnameFileLink() {
        if (oldfilename!==null && choixAjoutModif) {
            setnomFichier(getFileNameFromLink(oldfilename))
        }
    }

   
    useEffect(() => {
        getnameFileLink();
    }, [oldfilename,choixAjoutModif]);

    function handlePastePreprocess(plugin, args) {
        const content = args.content;
        
        // Définir la police par défaut pour le texte collé
        const defaultFontFamily = 'Tahoma';
        console.log('Police!!!')
        
        // Modifier le contenu collé pour utiliser la police par défaut
        args.content = `<span style="color:red;font-family: ${defaultFontFamily};">${content}</span>`;
      }


    return (
        <div className="p-1  style-modal-tamby flex " style={{ alignItems: 'center', flexDirection: 'column' }} >
            <Toast ref={toastTR} position="top-center" />

            <div className='col-12 pt-0 flex  justify-conten-between pb-3' style={{ borderBottom: '1px solid #efefef', alignItems: 'center' }} >
                <div className="field   lg:col-6 md:col-12 col:12 m-0 p-0">
                    <h2 className=" m-1">{choixAjoutModif? 'Modification du modèle d\'examen' : 'Entrez le nom du nouvel examen'} :</h2>
                    <div >
                        <InputText disabled={choixAjoutModif} id="username2" style={{ width: '50%', height: '35px' }} aria-describedby="username2-help" name='nom' value={nomFichier} onChange={(e) => { setnomFichier(e.target.value) }} />

                    </div>
                    <small style={{ color: 'gray' }} >Exemple : Abdominal F</small>
                    <div className="lg:col-6 md:col-12 col-12 field my-1 flex flex-column">
                        <label style={{ color: 'gray' }} >Cocher içi si vous voulez modifier le modele de compte rendu</label>
                        <Checkbox id="basic" checked={choixAjoutModif} name='pec' className={"form-input-css-tamby"} tooltip='Cliquer ici pour faire le modification de modèle' onChange={(e) => {
                            if (choixAjoutModif) {
                                setchoixAjoutModif(false);
                                setnomFichier('')
                            } else {
                                setchoixAjoutModif(true);
                            }
                        }} />
                    </div>
                </div>
                <div className="field   lg:col-6 md:col-12 col:12 m-0 p-0">
                    <CRmodel sethtmlm={setmodel} setrecHtml={setrecHtml} recHtml={recHtml} setoldfilename={setoldfilename} />
                </div>
            </div>
            <div className='col-12 mt-3 mb-3' >
                <Button icon={choixAjoutModif ? PrimeIcons.PENCIL : PrimeIcons.SAVE} className='p-button-sm p-button-primary '
                    label={choixAjoutModif ?
                        chargePost.chajoute ?
                            'Modification...' : 'Modifier' :
                        chargePost.chajoute ?
                            'Enregistrement...' : 'Enregistrer'} onClick={log} />


                <ReactToPrint trigger={() =>
                    <Button icon={PrimeIcons.EYE} className='p-button-sm p-button-secondary ml-3 ' label={'Visualiser'} />
                } content={() => visualier()} />
            </div>


            <div className='mb-3 col-10'  >
                <BundledEditor
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={model}
                    init={{
                        height: 700,
                        menubar: false,

                        plugins: [
                            'advlist', 'font', 'anchor',  'help', 'image',  'lists',
                            'searchreplace', 'table', 'wordcount', 'pagebreak', 'spellchecker'
                        ],
                        toolbar: 'police| undo redo | fontfamily fontsize | ' +
                            'bold italic forecolor underline | alignleft aligncenter | fontselect | styleselect ' + 'alignright alignjustify | bullist numlist outdent indent | ' + 'table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol' +
                            'removeformat',
                        language: 'fr_FR',
                        font_formats:
                            "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
                        content_style: 'body {  font-family:Helvetica,Arial,sans-serif;min-height:21cm;padding:3px 25px;margin:0 2%;clip-path:inset(-15px -15px 0px -15px); box-shadow:0 0 3px 0px rgba(0, 0, 0, 0.219); font-size:14px } '
                    }}
                />
            </div>
            <div className='hidden'>
                <div id="scann" ref={(el) => (reportTemplateRef = el)}>
                    <div id="print" className='cr_ins' style={{ fontSize: '1.4em' }}></div>
                </div>
            </div>
        </div>
    )
}
