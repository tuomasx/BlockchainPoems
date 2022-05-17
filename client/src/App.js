import React from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import { newContextComponents } from "@drizzle/react-components";
import "./App.css";
import Web3 from "web3";
import poemContract from "./artifacts/poemContract.json"; 

const { AccountData, ContractData, ContractForm } = newContextComponents;
const options = {
  web3: {
    block: false,
    customProvider: new Web3(Web3.givenProvider || "ws://localhost:7545"),
  },
  contracts: [poemContract],
  events: {
    
  },
};

//var formValue = localStorage.getItem('SelectedOption');
let formValue = null;
if (formValue == null) {
  formValue = 0;
} 
const drizzle = new Drizzle(options);

class GetPoemForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: localStorage.getItem( 'SelectedOption' )
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    localStorage.setItem( 'SelectedOption', this.state.value );
    formValue = this.state.value;
    console.log(formValue);
    
  }

  render() {
    return (
      <div style={{display: 'grid',  justifyContent:'center', alignItems:'center'}}>
        <h3> Enter the name of the poem to fetch </h3>
        <form onSubmit={this.handleSubmit}>
          <label>
            {"Enter the poem name: \t"}
            <textarea value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
    </div>
    );
  }
}

class DrizzleReactComponent extends React.Component {

  render() {
    return(
<DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return "Loading..."
          }

          return (
            <div className="App">
              <div>
                <h1>Blockchain poems</h1>
              </div>

              <div className="section">
                <h2>Account data:</h2>
                <AccountData
                  drizzle={drizzle}
                  drizzleState={drizzleState} 
                  accountIndex= {1}
                  units="ether"
                  precision={3}
                />
              </div>
              <div className="section">
                <h2>Poem Contract interface</h2>
                <p>
                  Currently it stores and adds some templates. From the field below, you can add more poems with a given name.
                </p>

                <ContractForm 
                  drizzle={drizzle} 
                  contract="poemContract"
                  method="addPoem"            
                  sendArgs={{gas: 500000}}/>

                <p>
                  <strong>Fetched poem name: </strong>
                  <ContractData
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                    contract="poemContract"
                    method="getPoemName"
                    methodArgs={[formValue]}
                  />
                </p> 
                <p>
                  <strong>Total poems authored: </strong>
                  <ContractData
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                    contract="poemContract"
                    method="getMyPoemCount"
                  />
                </p> 

                
              </div>
            </div>
          )
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
    )
  }
  
}

function App() {
  return (
    <div>
    <div style={{display: 'grid',  justifyContent:'center', alignItems:'center', height: 'auto'}}>
      <DrizzleReactComponent/>
      <GetPoemForm/>
    </div>


    </div>

    );
}

export default App;
