import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const problems = [
  {
    title: "Design a Parking Lot",
    slug: "parking-lot",
    description:
      "Design an object-oriented parking lot that supports multiple floors and different parking spot sizes. Vehicles should be assigned the nearest available fitting spot, and the system should issue tickets and calculate parking fees when vehicles leave.",

    difficulty: "Easy",

    functionalRequirements: JSON.stringify([
      "Support three vehicle types: Motorcycle, Car, and Truck.",
      "Support three spot sizes: Small, Medium, and Large. A larger spot can fit a smaller vehicle.",
      "park(vehicle) should assign a suitable spot and return a Ticket.",
      "unpark(ticket) should release the spot and return the parking fee.",
      "Track parking availability per floor and across the entire parking lot.",
      "Handle the case where the parking lot is full.",
    ]),

    bonusRequirements: JSON.stringify([
      "Support hourly tiered pricing: first hour free, then ₹50 per hour.",
      "Support multiple entry and exit gates.",
      "Support reserved EV parking spots.",
    ]),

    concepts: JSON.stringify([
      "Inheritance",
      "Polymorphism",
      "Enum",
      "Factory",
      "Strategy",
    ]),

    rubric: JSON.stringify([
      "Classes have clear and focused responsibilities.",
      "Abstraction and encapsulation are used appropriately.",
      "Dependencies and coupling are kept reasonable.",
      "The design can support the required extensions without major changes.",
      "The solution avoids unnecessary complexity and uses design patterns with clear justification.",
    ]),

    hints: JSON.stringify([
      {
        type: "uml",
        title: "UML class diagram",
        content:
          "Consider ParkingLot, ParkingFloor, ParkingSpot, Ticket, an abstract Vehicle hierarchy, and a FeeStrategy interface.",
      },
      {
        type: "hint",
        title: "Hint #1",
        content:
          "Start with an abstract Vehicle and a SpotSize enum. Use polymorphism to determine the required spot size for each vehicle.",
      },
      {
        type: "hint",
        title: "Hint #2",
        content:
          "Use a FeeStrategy interface so pricing logic stays separate from the parking lot itself.",
      },
      {
        type: "hint",
        title: "Hint #3",
        content:
          "A map of available spots grouped by SpotSize can make finding a suitable spot efficient.",
      },
    ]),
  },

  {
    title: "Design a Vending Machine",
    slug: "vending-machine",
    description:
      "Model a vending machine that accepts coins, lets a user select a product, dispenses the product, and returns change. The machine moves through the states Idle → HasMoney → Dispensing → Idle. The main goal is to implement the State pattern cleanly.",

    difficulty: "Easy",

    functionalRequirements: JSON.stringify([
      "Support the states Idle, HasMoney, and Dispensing.",
      "Support insertCoin(coin), selectProduct(code), dispense(), and refund().",
      "Track inventory for each product code.",
      "Invalid state transitions must be rejected.",
    ]),

    bonusRequirements: JSON.stringify([
      "Support multiple coin denominations and calculate change.",
      "Support a restock API.",
    ]),

    concepts: JSON.stringify([
      "State Pattern",
      "Enum",
      "Inventory",
    ]),

    rubric: JSON.stringify([
      "MachineState is an interface with one concrete class for each state: Idle, HasMoney, and Dispensing.",
      "State-specific behavior lives on the state classes instead of using a large switch on the current state.",
      "Invalid transitions are explicitly rejected rather than silently ignored.",
      "VendingMachine exposes only the necessary state-changing operations while keeping its internals encapsulated.",
      "Inventory is updated consistently as part of the dispense operation.",
    ]),

    hints: JSON.stringify([
      {
        type: "uml",
        title: "UML class diagram",
        content:
          "Consider VendingMachine, a MachineState interface, and concrete IdleState, HasMoneyState, and DispensingState classes.",
      },
      {
        type: "hint",
        title: "Hint #1",
        content:
          "Make MachineState an interface and create one concrete class per state.",
      },
      {
        type: "hint",
        title: "Hint #2",
        content:
          "Each state should know which transitions are legal and delegate valid transitions back to the VendingMachine.",
      },
    ]),
  },

  {
    title: "Design an Elevator System",
    slug: "elevator-system",
    description:
      "Design an elevator system for a building with N floors and M elevators. People can make external hall requests using up/down buttons and internal requests by selecting a destination floor. A dispatcher chooses which elevator should answer each hall request.",

    difficulty: "Medium",

    functionalRequirements: JSON.stringify([
      "External requests contain a floor and direction.",
      "Internal requests contain a destination floor.",
      "Support a pluggable DispatchStrategy.",
      "Elevators should move floor-by-floor.",
      "Each tick should advance the elevator by one floor and expose its current path or state.",
    ]),

    bonusRequirements: JSON.stringify([
      "Support multiple dispatch strategies such as Nearest-Car and SCAN/LOOK.",
      "Support configurable elevator capacity.",
      "Support emergency or maintenance mode.",
    ]),

    concepts: JSON.stringify([
      "Strategy Pattern",
      "Priority Queue",
      "Concurrency Mental Model",
    ]),

    rubric: JSON.stringify([
      "DispatchStrategy is an interface and ElevatorSystem accepts it through dependency injection.",
      "Each elevator tracks pending stops efficiently in separate upward and downward ordered collections.",
      "step() advances the elevator by exactly one floor instead of using one large simulation loop.",
      "External and internal requests are represented using a common Request abstraction where appropriate.",
      "An idle elevator has an explicit IDLE direction rather than representing its direction as null.",
    ]),

    hints: JSON.stringify([
      {
        type: "uml",
        title: "UML class diagram",
        content:
          "Consider ElevatorSystem, Elevator, Request, Direction, a DispatchStrategy interface, and concrete strategies such as NearestCarStrategy and ScanStrategy.",
      },
      {
        type: "hint",
        title: "Hint #1",
        content:
          "Each Elevator can maintain sorted pending stops for the direction in which it is travelling.",
      },
      {
        type: "hint",
        title: "Hint #2",
        content:
          "The dispatcher can select an elevator using a cost such as distance, direction compatibility, and current workload.",
      },
    ]),
  },
];

async function main() {
  console.log("Seeding LLD Dojo problems...");

  for (const problem of problems) {
    await prisma.problem.upsert({
      where: {
        slug: problem.slug,
      },
      update: problem,
      create: problem,
    });

    console.log(`✓ ${problem.title}`);
  }

  console.log("Finished seeding problems.");
}

main()
  .catch((error) => {
    console.error("SEED ERROR:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });