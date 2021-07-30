import {  CashierCRUD, CashRegCRUD } from './db';



//createShop({name: 'METRO', city: 'Odessa', address: 'Khmelnitskay 88', cashRegisters: []})
//CashRegCRUD.read({id:1});
CashierCRUD.read({sex:'male'},{worksInShifts:'dayShift'})