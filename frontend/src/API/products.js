import car_001 from '../Asset/img/car-001.png';
import car_002 from '../Asset/img/car-002.png';
import car_003 from '../Asset/img/car-003.png';
import car_004 from '../Asset/img/car-004.png';

import e_car_001 from '../Asset/img/e-car-001.png';
import e_car_002 from '../Asset/img/e-car-002.png';

import bike_001 from '../Asset/img/bike-001.png';
import bike_002 from '../Asset/img/bike-002.png';
import bike_003 from '../Asset/img/bike-003.png';
import bike_004 from '../Asset/img/bike-004.png';

import e_bike_001 from '../Asset/img/e-bike-001.png';
import e_bike_002 from '../Asset/img/e-bike-002.png';




const products = [
    {   
        id: 0, 
        productId: "car-001",
        productName: "Mahindra Scorpio",
        productCategory: "Car",
        productDescription: "The Scorpio is testament to the fact ‘Old is Gold’. It has been marking territory on Indian Roads since 2002 and all its models are sturdy like a bull! From Bare Bones to Beast Mode, the steering on this car has evolved to traverse through the toughest roads. The design ensures that thrills of the journey come with adequate safety and comfort for travellers.",
        rating: 4.2,
        noOfRatings: 201, 
        price: 5899,
        image: car_001
    },
    {   
        id: 1,
        productId: "bike-001",
        productName: "Yamaha FZ v2",
        productCategory: "Bike",
        productDescription: "The FZ-S Version 2.0 is the second generation of the FZ series commuter motorcycle, the FZ16 being the original. Design-wise, the model is extremely similar to the standard FZ V 2.0 which gets a two piece seat, revised bikini faring, and shrouds beneath the fuel tank.",
        rating: 4.1, 
        noOfRatings: 981, 
        price: 499,
        image: bike_001
    },
    {   
        id: 2, 
        productId: "car-002",
        productName: "Mahindra Bolero",
        productCategory: "Car",
        productDescription: "If you’re going off roading in the monsoons or taking a trip to North East India, Bolero is your best bet! It is perfect for countryside touring and is sturdy enough to tackle weather beatings, wet patches, slumps etc. The Bolero is apt for the soulful traveller.",
        rating: 4.4, 
        noOfRatings: 111, 
        price: 3999,
        image: car_002
    },
    {   
        id: 3, 
        productId: "e-car-001",
        productName: "Hyundai Kona Electric",
        productCategory: "Electric Car",
        productDescription: "The price of Hyundai Kona Electric starts at Rs. 23.84 Lakh and goes upto Rs. 24.03 Lakh. Hyundai Kona Electric is offered in 2 variants - the base model of Kona Electric is Premium and the top variant Hyundai Kona Premium Dual Tone which comes at a price tag of Rs. 24.03 Lakh.",
        rating: 4.9, 
        noOfRatings: 21, 
        price: 6999,
        image: e_car_001
    },
    {   
        id: 4, 
        productId: "e-car-002",
        productName: "Tata Tiago EV",
        productCategory: "Electric Car",
        productDescription: "The price of Tata Tiago EV starts at Rs. 8.69 Lakh and goes upto Rs. 11.99 Lakh. Tata Tiago EV is offered in 7 variants - the base model of Tiago EV is XE Base and the top variant Tata Tiago EV XZ Plus Tech LUX Fast Charge which comes at a price tag of Rs. 11.99 Lakh.",
        rating: 4.6, 
        noOfRatings: 212, 
        price: 5999,
        image: e_car_002
    },
    {   
        id: 5, 
        productId: "car-003",
        productName: "Maruti Suzuki Swift",
        productCategory: "Car",
        productDescription: "The Swift lives up to its name and more. A sturdy 5-seater with a strong design, this car has been a steady companion on the roads for many years. This car is extremely easy to manoeuvre and manage in every terrain. Rent a red Swift for a coastal drive or a winding drive up the hills, without a care in the world!",
        rating: 4.3, 
        noOfRatings: 101, 
        price: 2999,
        image: car_003
    },
    {   
        id: 6, 
        productId: "bike-002",
        productName: "Yamaha R15",
        productCategory: "Bike",
        productDescription: "Yamaha R15 V4 is a sports bike available at a starting price of Rs. 1,81,672 in India. It is available in 6 variants and 6 colours with top variant price starting from Rs. 1,94,249. The Yamaha R15 V4 is powered by 155cc BS6 engine which develops a power of 18.1 bhp and a torque of 14.2 Nm. With both front and rear disc brakes, Yamaha R15 V4 comes up with anti-locking braking system. This R15 V4 bike weighs 142 kg and has a fuel tank capacity of 11 liters",
        rating: 4.7,
        noOfRatings: 91,  
        price: 799,
        image: bike_002
    },
    {   
        id: 7, 
        productId: "e-bike-001",
        productName: "Ultraviolette F77",
        productCategory: "Electric Bike",
        productDescription: "The F77 is a perfect example of electric motorcycles being fun and engaging to ride. However, given its pricing, it will remain a niche product. Nevertheless, it is also a proof of how an Indian company can make a modern two-wheeler with cutting-edge technologies.",
        rating: 4.8,
        noOfRatings: 211,  
        price: 999,
        image: e_bike_001
    },
    {   
        id: 8, 
        productId: "bike-003",
        productName: "KTM 390 Duke",
        productCategory: "Bike",
        productDescription: "KTM 390 Duke is a street bike available at a starting price of Rs. 2,95,159 in India. It is available in only 1 variant and 2 colours. The KTM 390 Duke is powered by 373.27cc BS6 engine which develops a power of 42.9 bhp and a torque of 37 Nm. With both front and rear disc brakes, KTM 390 Duke comes up with anti-locking braking system. This 390 Duke bike weighs 171 kg and has a fuel tank capacity of 13.4 liters",
        rating: 4.9, 
        noOfRatings: 2011, 
        price: 1099,
        image: bike_003
    },
    {   
        id: 9, 
        productId: "car-004",
        productName: "Toyota Innova",
        productCategory: "Car",
        productDescription: "If a comfortable trip with enough legroom and roomy interiors is your choice, the Innova dominates! It is a first choice for family or group trips and is so reliable that Innova car rentals do brilliantly even during the off -tourist season! Comfortable, both in price and journey, rent an Innova to have a pocket-friendly trip.",
        rating: 4.1, 
        noOfRatings: 119, 
        price: 4299,
        image: car_004
    },
    {   
        id: 10, 
        productId: "e-bike-002",
        productName: "Revolt RV400",
        productCategory: "Electric Bike",
        productDescription: "The price of Revolt RV400 in India starts at Rs. 1,24,999.Revolt RV400 is offered in 1 variant - Revolt RV400 STD which comes at a price tag of Rs. 1,24,999",
        rating: 4.0, 
        noOfRatings: 321, 
        price: 1599,
        image: e_bike_002
    },
    {   
        id: 11, 
        productId: "bike-004",
        productName: "Royal Enfield Thunderbird bs4",
        productCategory: "Bike",
        productDescription: "Royal Enfield could launch a more affordable variant of the Thunderbird 350 soon. The upcoming variant will get cosmetic changes and will come equipped with a single-channel ABS instead of the dual-channel unit seen on the standard model. Expect the upcoming variant to be priced around Rs 1.47 lakh, making it Rs 7,000 to Rs 8,000 more affordable than the standard variant.",
        rating: 4.3, 
        noOfRatings: 911, 
        price: 899,
        image: bike_004
    },
]

export default products;