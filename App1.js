import React, { Component } from 'react';
import { Alert, SafeAreaView, Text, Button, StyleSheet, TextInput } from 'react-native';

// import { CFPaymentGatewayService } from 'react-native-cashfree-pg-sdk';

import { CFPaymentGatewayService } from 'react-native-cashfree-pg-api';

import { CFSession, CFThemeBuilder, CFEnvironment, CFUPIIntentCheckoutPayment } from 'cashfree-pg-api-contract';
cle
const App1 = ({ 
    orderAmount, 
    currency, 
    customer_id, 
    customer_name, 
    customer_email, 
    customer_phone, 
    onCustomerIDChange, 
    onCustomerNameChange, 
    onCustomerPhoneChange, 
    onCustomerEmailChange, 
    onOrderAmountChange, 
    onCurrencyChange, 
    createorder,  // Directly pass the create order function
    paymentSessionID, 
    orderID 
}) => {

    const upicheckout = async () => {
        if (!paymentSessionID || !orderID) {
            await createorder(); // Create order if session or order ID is missing
        }

        try {
            const session = new CFSession(
                paymentSessionID, // Pass the correct session ID
                orderID, // Pass the correct order ID
                CFEnvironment.SANDBOX
            );

            const theme = new CFThemeBuilder()
                .setNavigationBarBackgroundColor('#E64A19')
                .setNavigationBarTextColor('#FFFFFF')
                .setButtonBackgroundColor('#FFC107')
                .setButtonTextColor('#FFFFFF')
                .setPrimaryTextColor('#212121')
                .setSecondaryTextColor('#757575')
                .build();

            const upiPayment = new CFUPIIntentCheckoutPayment(session, theme);
            CFPaymentGatewayService.doUPIPayment(upiPayment);
        } catch (e) {
            console.log(e.message);
        }
    };

    const webcheckout = async () => {
        if (!paymentSessionID || !orderID) {
            await createorder(); // Create order if session or order ID is missing
        }

        try {
            const session = new CFSession(
                paymentSessionID, // Pass the correct session ID
                orderID, // Pass the correct order ID
                CFEnvironment.SANDBOX
            );
            console.log('Session', JSON.stringify(session));
            CFPaymentGatewayService.doWebPayment(JSON.stringify(session));
        } catch (e) {
            console.log(e.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Welcome to my React Native App!</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Customer ID"
                value={customer_id}
                onChangeText={onCustomerIDChange}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={customer_name}
                onChangeText={onCustomerNameChange}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={customer_email}
                onChangeText={onCustomerEmailChange}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                value={customer_phone}
                onChangeText={onCustomerPhoneChange}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter Order Amount"
                value={orderAmount}
                onChangeText={onOrderAmountChange}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter Currency"
                value={currency}
                onChangeText={onCurrencyChange}
            />
            <Button title="Create Order" onPress={createorder} />
            <Text style={{ marginVertical: 10 }} />
            <Button title="Web Checkout" onPress={webcheckout}  />
            <Text style={{ marginHorizontal: 10 }} />
            <Button title="UPI Checkout" onPress={upicheckout}  />
        </SafeAreaView>
    );
};

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            orderID: '',
            paymentSessionID: '',
            customer_id: '',
            customer_name: '',
            customer_email: '',
            customer_phone: '',
            orderAmount: '',
            currency: '',
        }
    }

    componentDidMount() {
        console.log('MOUNTED');
        CFPaymentGatewayService.setCallback({
            onVerify: (orderID) => {
                this.changeResponseText('orderId is :' + orderID);
            },
            onError: (error, orderID) => {
                this.changeResponseText(
                    'exception is : ' + JSON.stringify(error) + '\norderId is :' + orderID
                );
            },
        });
    }

    componentWillUnmount() {
        console.log('UNMOUNTED');
        CFPaymentGatewayService.removeCallback();
    }

    changeResponseText(text) {
        console.log(text);
    }

    // Update the createorder method to set state
    createorder = async () => {
        const orderData = {
            orderAmount: parseFloat(this.state.orderAmount), // Ensure it's a number
            orderCurrency: this.state.currency,
            customerDetails: {
                customer_id: this.state.customer_id,
                customer_name: this.state.customer_name,
                customer_email: `${this.state.customer_name.replace(" ", ".")}@cashfree.com`,
                customer_phone: this.state.customer_phone,
            },
            returnUrl: "http://127.0.0.1:5500/Test.html",
        };

        try {
            const response = await fetch('http://192.168.100.112:3000/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            const paymentSessionId = result.payment_session_id;
            const orderID = result.order_id;

            this.setState({ paymentSessionID: paymentSessionId, orderID });
            console.log("Order ID: " + orderID);
            console.log('Payment Session ID: ' + paymentSessionId);

            Alert.alert('Order created successfully!', 'Click on Pay now to proceed to the Checkout page');
        } catch (error) {
            console.error('Error creating order:', error);
            Alert.alert('Error creating order:', error.message);
        }
    }

    render() {
        return (
            <App1
                orderAmount={this.state.orderAmount}
                currency={this.state.currency}
                customer_id={this.state.customer_id}
                customer_name={this.state.customer_name}
                customer_email={this.state.customer_email}
                customer_phone={this.state.customer_phone}
                onCustomerIDChange={(text) => this.setState({ customer_id: text })}
                onCustomerNameChange={(text) => this.setState({ customer_name: text })}
                onCustomerEmailChange={(text) => this.setState({ customer_email: text })}
                onCustomerPhoneChange={(text) => this.setState({ customer_phone: text })}
                onOrderAmountChange={(text) => this.setState({ orderAmount: text })}
                onCurrencyChange={(text) => this.setState({ currency: text })}
                paymentSessionID={this.state.paymentSessionID} // Pass down the state
                orderID={this.state.orderID} // Pass down the state
                createorder={this.createorder} // Pass down the create order function
            />
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        width: '80%',
        marginBottom: 20,
    },
    button: {
        marginTop: 40,
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'column',
        alignItems: 'center',
    },
});
