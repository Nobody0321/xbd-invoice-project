/**
 * Created by groundlee on 2016/12/19.
 */

/**
 * 把常见的dialog封装到这里，为了以后方便移植
 */

// import $ from 'zepto'
import { Toast } from 'mint-ui';
import { MessageBox } from 'mint-ui';

class CommonDialog{
    constructor(){}


    alert(text,title,callback) {
	    MessageBox.alert(text,title, callback);
    }
    confirm(text,title,callbackOk,callbackCancel){MessageBox.confirm(text,title,callbackOk,callbackCancel)}


    propmt(text,title,callbackOk,callbackCancel){MessageBox.prompt(text,title,callbackOk,callbackCancel)}

    //showPreloader(text){$.showPreloader(text)}
    //hidePreloader(){$.hidePreloader()}
    //showIndicator(){$.showIndicator()}
    //hideIndicator(){$.hideIndicator()}
    toast(text){Toast(text)}

}




const commonDialog = new CommonDialog()

export default commonDialog
