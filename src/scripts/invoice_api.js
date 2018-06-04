/**
 * Created by groundlee on 2017/10/01.
 */
import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

const web_apis = {
    postNewInvoice: {method: 'POST', url: '/invoice/', token: true},
    deleteInvoice: {method: 'DELETE', url: '/invoice/{id}/', token: true},
    getInvoices: {method: 'GET', url: '/invoice/', token: true},
    getInvoice: {method: 'GET', url: '/invoice/{id}/', token: true},
}


import {ApiBase} from './api_base.js'

const invoiceApi = new ApiBase(web_apis,'/invoice')

export default invoiceApi


