import type { Customer } from "@/components/customers/types/customer.types";
import { customer, addr, game, voucher } from "./customer-store-builders";

export const INITIAL_CUSTOMERS: Customer[] = [
  customer("c1", "Amina Hassan", "+971 55 111 2222", "amina@email.com", "15 March", "Dubai Marina", 24, 3840, "Gold", 2450, -1, "2025-01-10", [
    addr("Home", "Marina Bay Tower A, Floor 12, Unit 1204, Dubai Marina", "Near the elevator"),
    addr("Work", "Dubai Damas tower, 28 Al Maktoum Road, Riggat Al Buteen, Dubai", "305 office number"),
  ], [
    game("Scratch & Win", 500, -3, "10% OFF"),
    game("Spin Wheel", 1200, -5, "Free Dessert"),
    game("Memory Match", 850, -18),
  ], [
    voucher("WELCOME20", "Welcome Offer", "20%", -8, 142),
    voucher("FLAT50", "Flat AED 50", "AED 50", -23, 210),
  ]),

  customer("c2", "Khalid Al Mansoori", "+971 50 333 4444", "khalid@email.com", "22 July", "JLT", 18, 2900, "Silver", 890, -5, "2025-03-15", [
    addr("Home", "JLT Cluster Y, Apt 1204, Dubai", "Gate code 4521"),
    addr("Work", "Dubai Media City, Building 7, Office 302", "Floor 3"),
  ], [
    game("Spin Wheel", 300, -12),
    game("Hungry Bird", 1500, -25, "Free Drink"),
  ], [
    voucher("SUMMER25", "Summer Special", "25%", -12, 180),
  ]),

  customer("c3", "Priya Nair", "+971 52 555 6666", "priya@email.com", "8 November", "Downtown", 12, 1680, "Bronze", 340, -3, "2025-06-20", [
    addr("Home", "Dubai Marina, Tower 3, Apt 2405", "Ring bell twice"),
  ], [
    game("Scratch & Win", 200, -3),
  ], [
    voucher("WELCOME20", "Welcome Offer", "20%", -28, 95),
  ]),

  customer("c4", "James Thornton", "+971 54 777 8888", "james@email.com", "3 January", "Business Bay", 8, 920, "Bronze", 120, -2, "2026-01-05", [
    addr("Home", "Business Bay, Bay Square, Bldg 3, Dubai", "Unit 1802"),
  ], [], []),

  customer("c5", "Sara Al Farsi", "+971 56 999 0000", "sara@email.com", "12 September", "Downtown", 31, 5200, "Platinum", 5100, 0, "2024-11-01", [
    addr("Home", "Downtown Dubai, Blvd Central, Tower 1", "Penthouse 4501"),
    addr("Work", "DIFC, Gate Village, Building 5, Office 201", "Reception 2nd floor"),
    addr("Other", "JBR Walk, Rimal 4, Apt 603, Dubai", "Beach access"),
  ], [
    game("Spin Wheel", 2500, -1, "AED 100 OFF"),
    game("Scratch & Win", 800, -4),
    game("Memory Match", 1200, -8, "20% OFF"),
    game("Vex Runner", 3000, -15, "Free Meal"),
  ], [
    voucher("BDAY2026", "Birthday Celebration", "AED 100", -31, 340),
    voucher("SUMMER25", "Summer Special", "25%", -11, 210),
    voucher("FLAT50", "Flat AED 50", "AED 50", -53, 180),
  ]),

  customer("c6", "Omar Khaleel", "+971 50 222 3333", "omar@email.com", "30 May", "JBR", 15, 2100, "Silver", 1100, -7, "2025-02-14", [
    addr("Home", "JBR Walk, Rimal 4, Apt 603, Dubai", "Call before arrival"),
  ], [
    game("Cheese Chase", 600, -13),
  ], [
    voucher("WELCOME20", "Welcome Offer", "20%", -63, 120),
  ]),
];
