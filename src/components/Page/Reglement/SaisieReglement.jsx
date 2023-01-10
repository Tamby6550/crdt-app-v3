
import React, { useRef, useState } from 'react';
import BundledEditor from '../../service/EditorTiny/BundledEditor';

import Facture from '../Facture';
import ReactToPrint from 'react-to-print'
  
export default function App() {
  const editorRef = useRef(null);
  let reportTemplateRef = useRef();
  const [content, setContent] = useState(null)

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      var myElement = document.getElementById("test");
      myElement.innerHTML = editorRef.current.getContent();

      setContent(editorRef.current.getContent())
    }
  };
  return (
    <div className=''>
      <div className='mb-3'>
        <BundledEditor
          onInit={(evt, editor) => editorRef.current = editor}
          initialValue='<p>Ito no donne donne initial afaka atao anaty use state ,forme string en forme html.</p>'
          init={{
            height: 500,
            menubar: false,
            plugins: [
              'advlist', 'anchor', 'autolink', 'help', 'image', 'link', 'lists',
              'searchreplace', 'table', 'wordcount', 'pagebreak',
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' + 'alignright alignjustify | bullist numlist outdent indent | ' + 'table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol' +
              'removeformat | help',
            language:'fr_FR',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif;width:21cm;min-height:21cm;padding:3px 10px;clip-path:inset(-15px -15px 0px -15px); margin:1cm 4cm;box-shadow:0 0 3px 0px rgba(0, 0, 0, 0.219); font-size:12px }'
          }}
        />
      </div>
      <button onClick={log} className="p-button mr-2">Enregistrer ici avant generation pdf</button>
      <ReactToPrint trigger={() => <button className="p-button">
        Generer pdf
      </button>} content={() => reportTemplateRef} />

      <div>

        <div className='ito' ref={(el) => (reportTemplateRef = el)}>
          <div>
            <div className='flex justify-content-between align-items center'>
              <div >
                <h1>Reglemenent</h1>
              </div>
              <div style={{ width: "45px", height: "auto" }}>
                <Facture />
              </div>
            </div>

            <div id='test' className='col-12 amboaro'></div>
          </div>
        </div>
      </div>
    </div>
  );
}