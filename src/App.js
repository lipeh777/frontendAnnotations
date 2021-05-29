
import React, {useState, useEffect} from 'react';
// import Header from './Header';
import './app.css';
import './main.css';
import './global.css';
import './sidebar.css';

import Notes from './Components/Notes';
import RadioButton from './Components/RadioButton';
import api from './services/api'


function App() {

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [allNotes, setAllNotes] = useState([]);
  const [selectedValue, setselectedValue] = useState('all');

  useEffect(() =>{
    getAllNotes()
  }, [])

  async function loadNotes(option){
    const params = {priority: option}
    const response = await api.get(`/priorities`, {params});

    if(response){
      setAllNotes(response.data)
    }

  }

  function handleChange(e){
    setselectedValue(e.value);

    if(e.checked && e.value != 'all'){
      loadNotes(e.value);
    }else{
      getAllNotes();
    }

  }

  async function getAllNotes(){
    const response = await api.get('/annotations',)
    setAllNotes(response.data)
  }

  async function handleChangePriority(id){
    const changePriority = await api.post(`/priorities/${id}`);

    if(changePriority && selectedValue != 'all'){
      loadNotes(selectedValue)
    }else if(changePriority){
      getAllNotes()
    }
  }

  async function handleDelete(id){
    const deletedNote = await api.delete(`/annotations/${id}`);

    if(deletedNote){
      setAllNotes(allNotes.filter(note => note._id != id));
    }

  }

  async function handleSubmit(e){
    e.preventDefault();

    const response = await api.post('/annotations',{
      title,
      notes,
      priority: false
    })

    setTitle('')
    setNotes('')

    if(selectedValue != 'all'){
      getAllNotes();
    }else{
      setAllNotes([ ...allNotes, response.data])
    }

    setselectedValue('all');

  }



 // useEffect(()=>{
 //  function enableSubmitButtom(){
 //    var btn = document.getElementById('btn_submit')
 //    btn.style.background = '#FFD3CA'

 //    if(title && notes){
 //      btn.style.background = "#EB8F7A"
 //    }
 //  }
 //  enableSubmitButtom()
 // }, [title, notes])



return(

  <div id="app">
    <aside>
      <strong>Caderno de Notas</strong>

      <form onSubmit={handleSubmit}>
        

        <div className="input-block">
          <label htmlFor="title">Titulo da Anotação</label>
          <input
            required
            maxLength="30"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="input-block">
          <label htmlFor="nota">Anotações</label>
          <textarea 
            required
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        {title && notes ? <button id="btn_submit" type="submit">Salvar</button> : <button className="disable" id="btn_submit" type="submit" disabled>Digite alguma anotação</button>}
      </form>
      < RadioButton 
        selectedValue={selectedValue}
        handleChange={handleChange}
      />
    </aside>
    <main>
      <ul>
        {allNotes.map(data =>(
        <Notes 
          key={data._id}
          data={data} 
          handleDelete={handleDelete}
          handleChangePriority={handleChangePriority}

        />
          ))}
      </ul>
    </main>
  </div>
);
}

export default App;
