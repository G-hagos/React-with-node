
import React,{useEffect, useState,useRef} from 'react'
import Add from './add';
import Edit from './edit'
import Request from "../Request/request";
//import { Button, Alert,Glyphicon } from "react-bootstrap";
import TransactionService from '../../services/transaction.service';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import UserService from '../../services/user.service';
import configs from '../../configs/local'
import AuthService from '../../services/auth.service';
import TransactionTable from "./transactionTable";
import Button from '../common/button';
import BalanceService from '../../services/balance.service';

const Transaction=()=> {
  const [{ isEdit, isAdd,isRequest }, setPageState] = useState({ isEdit: 0, isAdd: 0,isRequest:0 })
  const [selectedTxn,setSelectedTxn]=useState([])
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [txData,settxData]=useState([])
  //const [resdata,setData]=useState([])
  const [users,setUsers]=useState([])
  const [usdBalance,setUsdBalance]=useState(0)
  const [localBalance,setLocalBalance]=useState(0)
  const [selectedPage, setSelectedPage] = useState('')



function handleAdd() {
  setPageState({ isEdit: 1, isAdd: 1 ,isRequest:0})
}
function handleRequest() {
  //
  setPageState({ isRequest: 1, isAdd:0, isEdit:0})
}
function handleSeeRequest() {
  setPageState({ isRequest: 1, isAdd:0,isEdit:0})
  //<Request handlePageSwitch={handlePageSwitch} selectedTxn={selectedTxn}/>
}
function handleSearch(e,property){
  
  console.log('######',property,e.target.value)
  const txDataTemp=[...txData]
  console.log('######',txDataTemp)
  const result=txDataTemp.filter(object=> {
    console.log(startDate,endDate)
    var date = startDate.getFullYear()+'-'+(startDate.getMonth()+1)+'-'+startDate.getDate();
    //var date2 = object['createdDate'].getFullYear()+'-'+(object['createdDate'].getMonth()+1)+'-'+object['createdDate'].getDate();
    console.log('date tiem...',date,object['createdDate'])
    //alert(e.target.value)
    return object[property]==e.target.value}
    )
  settxData(result)
}
function handleChange(e,property){
  console.log('@@@@@@@',property,e.target.value)
  /* if(property=='userId') setFagent(e.target.value)
  if(property=='status') setFstatus(e.target.value)
  if(property=='country') setFcountry(e.target.value) */
 // if(property=='status') setFstatus(e.target.value)

 handleSearch(e,property)
}
function handlePageSwitch(){
  setPageState({ isEdit: 0, isAdd: 0, isRequest:0});
  window.location.reload(false)
}
useEffect(()=>{
   TransactionService.getAllTransactions().then((res)=>{
    const response=res.data
    // setData(response)
    UserService.getUsers().then((res)=>{
      console.log('response from users',res.data)
      let userResponse=res.data
      console.log('current user',AuthService.getCurrentUser())

      if(AuthService.getCurrentUser().role!==1){
        //filter transaction data based on agent
        let filtered=response.filter((f=>f.userId==AuthService.getCurrentUser().id))
   
        let filteredUser=userResponse.filter((u)=>u.id===AuthService.getCurrentUser().id)  
        settxData(filtered)
        setUsers(filteredUser)
      }
      else{
        settxData(response) 
        setUsers(res.data)} 
  })
  
   }).catch(err=>{
     console.log(err)
       console.log('error fetching data from transaction table..........')
       
   })
   users.map(e=>{
   BalanceService.getBalances().then((res)=>{
    res.data.map(user => {
      if(user.userId==e.userId){
        setUsdBalance(user.USDbalance)
        setLocalBalance(user.localBalance)
      }
     })
     })
   })
 
},[])
console.log('user....',users)
  return(
        <div className='transactions'>         
          {!isEdit && !isAdd && isRequest==0?(
            <div>
              <div className='search-row'>
              <div className="row-9"><span>&nbsp;&nbsp;&nbsp;</span>
              <img src='../../refresh.jpg' style={{height:'55px',width:'55px',borderRadius:'15px',marginTop:'-10px'}} alt='refresh' onClick={()=>window.location.reload(false)}></img>
              </div>
              <div>
              {AuthService.getCurrentUser().role===1 &&
              <select class='form-control selectpicker' style={{marginTop:'25px'}} onChange={(e)=>handleChange(e,'userId')}>
                                <option disabled="disabled" selected="selected">select agent</option>
                                {users.map((item,index)=>{
                                       return <option value={item.id}>{item.name}</option>
                                })}
                            </select>
               }
          <select class="form-control selectpicker" style={{marginTop:'25px'}} onChange={(e)=>handleChange(e,'status')}>
          <option disabled="disabled" selected="selected">select status</option>
          {configs.statuses.map((s,index)=>{
                                       return <option value={s}>{s}</option>
                                })}
          </select>
          </div>
          <span>&nbsp;&nbsp;&nbsp;</span>
          <div className="row-9"><span>&nbsp;&nbsp;</span>
          <select class="form-control selectpicker" onChange={(e)=>handleChange(e,'sCountry')}>
          <option disabled="disabled" selected="selected">Sender Country</option>
          {configs.countries.map((c,index)=>{
                                       return <option value={c}>{c}</option>
                                })}
          </select> 
          <span>&nbsp;&nbsp;&nbsp;</span>
          <select class="form-control selectpicker" onChange={(e)=>handleChange(e,'rCountry')}>
          <option disabled="disabled" selected="selected">Receiver Country</option>
          {configs.countries.map((c,index)=>{
                                       return <option value={c}>{c}</option>
                                })}
          </select>
          </div>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <div className='datepickercss'>
            <div>
          Start Date: <DatePicker className='input--style-4' selected={startDate} style={{marginLeft:'0'}} onChange={(Date) => setStartDate(Date)} />
            </div>
            <div>
          End Date: <DatePicker className='input--style-4' selected={endDate} onChange={(Date) => setEndDate(Date)}/>
            </div>
            
            {/* {AuthService.getCurrentUser().role===1 &&
           <div>
            <Button variant='primary'  style={{marginBottom:'5px',marginTop:'25px',minWidth:'150px',maxHeight:'20px'}} onClick={()=>handleSeeRequest()}>See your request</Button> 
          </div>
            } */}
     
          </div>
          <div>
          {AuthService.getCurrentUser().role===1 &&
            <div>
            <Button label='Add New Transaction' handleAdd={handleAdd}/>
           </div>
                }
          {AuthService.getCurrentUser().role!==1 &&
              <div style={{marginLeft:'5px',fontWeight:'bold'}} className='balance-box'>Usd Balance:<p class="balanceNumber">{!!users[0]?parseFloat(usdBalance).toLocaleString('en-US'):''}</p></div>        
          }
          

          </div>
          {/* <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> */}
          <div>
          {AuthService.getCurrentUser().role!==1 &&
          <div style={{marginLeft:'5px',fontWeight:'bold'}} className='balance-box'>local Balance:<p class="balanceNumber">{!!users[0]?parseFloat(localBalance).toLocaleString('en-US'):''}</p></div>
          }
          </div>
          {/*<div className="col-9">
           <div className="row-9"><span>&nbsp;&nbsp;</span></div>
          
          {AuthService.getCurrentUser().role!==1 &&
            <Button variant='primary'  style={{marginBottom:'5px',maxHeight:'40px'}} onClick={()=>handleRequest()}>Request Balance</Button>
          }
          </div> */}
          </div>
          <div className='log-pagination'>
        {/* transsaction first page after login  
         and Paginate data
        */}
        
        
        <TransactionTable 
           data={txData}
           dataLimit={4}
           pageLimit={4}
           setSelectedPage={setSelectedPage}
           setPageState={setPageState}
           handlePageSwitch={handlePageSwitch}
           selectedTxn={selectedTxn}
           setSelectedTxn={setSelectedTxn}
        />
        {/* adding pagination to the transaction page */}
        {/* <Pagination
                  data={txData}
                  dataLimit={3}
                  pageLimit={5}
                  setPageState={setPageState}
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                  handleSelection={handleSelection}
        />  */}
        </div>
            </div>
            
          ):isEdit && !isAdd && isRequest==0?(
        <Edit handlePageSwitch={handlePageSwitch} selectedTxn={selectedTxn}/>)
        :!isEdit && !isAdd && isRequest==1?
        <Request handlePageSwitch={handlePageSwitch} selectedTxn={selectedTxn}/>:
        <Add handlePageSwitch={handlePageSwitch} selectedTxn={selectedTxn}/>
        }
        {/* {isRequest==1 &&
          <Add handlePageSwitch={handlePageSwitch}/>
          
        } */}

        </div>      
  )    
}
export default Transaction