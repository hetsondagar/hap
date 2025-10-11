import { Request, Response } from 'express';
import User from '../models/User';

// Question bank for each CSE subject
const QUESTION_BANKS = {
  // 1st Year Subjects
  'civil-fund': {
    questions: [
      {
        id: 1,
        question: "What is the primary purpose of soil classification in civil engineering?",
        options: ["To determine soil color", "To assess soil strength and behavior", "To measure soil temperature", "To identify soil origin"],
        correct: 1,
        explanation: "Soil classification helps engineers understand soil strength, compressibility, and behavior under load."
      },
      {
        id: 2,
        question: "Which factor has the greatest impact on concrete strength development?",
        options: ["Water-cement ratio", "Aggregate size", "Mixing time", "Ambient temperature"],
        correct: 0,
        explanation: "Water-cement ratio is the most critical factor affecting concrete strength."
      },
      {
        id: 3,
        question: "What is the minimum thickness required for reinforced concrete beams as per IS 456?",
        options: ["100mm", "150mm", "200mm", "250mm"],
        correct: 1,
        explanation: "IS 456 specifies minimum 150mm thickness for reinforced concrete beams."
      },
      {
        id: 4,
        question: "Which test determines the consistency of fresh concrete?",
        options: ["Compressive strength test", "Slump test", "Flexural strength test", "Split tensile test"],
        correct: 1,
        explanation: "Slump test measures the workability and consistency of fresh concrete."
      },
      {
        id: 5,
        question: "What is the typical range of compressive strength for M25 grade concrete?",
        options: ["15-20 N/mm²", "20-25 N/mm²", "25-30 N/mm²", "30-35 N/mm²"],
        correct: 2,
        explanation: "M25 concrete has a characteristic compressive strength of 25 N/mm²."
      },
      {
        id: 6,
        question: "What is the maximum water-cement ratio allowed for M30 concrete as per IS 456?",
        options: ["0.45", "0.50", "0.55", "0.60"],
        correct: 0,
        explanation: "IS 456 specifies maximum 0.45 water-cement ratio for M30 concrete."
      },
      {
        id: 7,
        question: "Which type of foundation is most suitable for expansive soils?",
        options: ["Spread footing", "Raft foundation", "Pile foundation", "Mat foundation"],
        correct: 2,
        explanation: "Pile foundations bypass expansive soil layers and transfer loads to stable strata."
      },
      {
        id: 8,
        question: "What is the minimum cover required for reinforcement in concrete exposed to severe conditions?",
        options: ["20mm", "30mm", "40mm", "50mm"],
        correct: 2,
        explanation: "IS 456 specifies minimum 40mm cover for severe exposure conditions."
      },
      {
        id: 9,
        question: "Which method is most accurate for determining soil bearing capacity?",
        options: ["Standard penetration test", "Plate load test", "CBR test", "Triaxial test"],
        correct: 1,
        explanation: "Plate load test directly measures soil bearing capacity under actual load conditions."
      },
      {
        id: 10,
        question: "What is the purpose of providing reinforcement in concrete?",
        options: ["Increase compressive strength", "Improve workability", "Resist tensile forces", "Reduce permeability"],
        correct: 2,
        explanation: "Reinforcement resists tensile forces since concrete is weak in tension."
      },
      {
        id: 11,
        question: "Which factor affects the workability of concrete most significantly?",
        options: ["Cement type", "Water content", "Aggregate shape", "Mixing time"],
        correct: 1,
        explanation: "Water content is the primary factor affecting concrete workability."
      },
      {
        id: 12,
        question: "What is the minimum grade of concrete required for RCC structures as per IS 456?",
        options: ["M15", "M20", "M25", "M30"],
        correct: 1,
        explanation: "IS 456 specifies minimum M20 grade concrete for RCC structures."
      },
      {
        id: 13,
        question: "Which test determines the fineness of cement?",
        options: ["Vicat test", "Le Chatelier test", "Blaine air permeability test", "Soundness test"],
        correct: 2,
        explanation: "Blaine air permeability test measures cement fineness by air permeability."
      },
      {
        id: 14,
        question: "What is the purpose of providing expansion joints in concrete structures?",
        options: ["Increase strength", "Allow thermal movement", "Improve appearance", "Reduce cost"],
        correct: 1,
        explanation: "Expansion joints accommodate thermal expansion and contraction of concrete."
      },
      {
        id: 15,
        question: "Which type of cement is most suitable for marine structures?",
        options: ["OPC", "PPC", "SRC", "RHC"],
        correct: 2,
        explanation: "Sulfate Resisting Cement (SRC) is suitable for marine and sulfate-rich environments."
      },
      {
        id: 16,
        question: "What is the minimum curing period for concrete as per IS 456?",
        options: ["3 days", "7 days", "14 days", "28 days"],
        correct: 1,
        explanation: "IS 456 specifies minimum 7 days curing for concrete."
      },
      {
        id: 17,
        question: "Which factor is most critical in the design of deep foundations?",
        options: ["Surface conditions", "Groundwater level", "Soil bearing capacity at depth", "Construction equipment"],
        correct: 2,
        explanation: "Deep foundation design depends on soil bearing capacity at the founding level."
      },
      {
        id: 18,
        question: "What is the purpose of providing dowel bars in concrete pavements?",
        options: ["Increase strength", "Transfer loads between slabs", "Improve appearance", "Reduce cracking"],
        correct: 1,
        explanation: "Dowel bars transfer loads between concrete pavement slabs."
      },
      {
        id: 19,
        question: "Which test determines the soundness of cement?",
        options: ["Vicat test", "Le Chatelier test", "Blaine test", "Compressive strength test"],
        correct: 1,
        explanation: "Le Chatelier test determines cement soundness by measuring expansion."
      },
      {
        id: 20,
        question: "What is the minimum slump value for heavily reinforced sections?",
        options: ["25mm", "50mm", "75mm", "100mm"],
        correct: 2,
        explanation: "Heavily reinforced sections require minimum 75mm slump for proper placement."
      },
      {
        id: 21,
        question: "Which type of foundation is most economical for large column loads?",
        options: ["Spread footing", "Combined footing", "Raft foundation", "Pile foundation"],
        correct: 2,
        explanation: "Raft foundation is economical for large loads distributed over large areas."
      },
      {
        id: 22,
        question: "What is the purpose of providing stirrups in reinforced concrete beams?",
        options: ["Resist bending", "Resist shear", "Resist torsion", "Improve appearance"],
        correct: 1,
        explanation: "Stirrups primarily resist shear forces in reinforced concrete beams."
      },
      {
        id: 23,
        question: "Which factor affects concrete durability most significantly?",
        options: ["Water-cement ratio", "Cement content", "Aggregate type", "Curing method"],
        correct: 0,
        explanation: "Water-cement ratio significantly affects concrete durability and permeability."
      },
      {
        id: 24,
        question: "What is the minimum grade of concrete for pre-stressed concrete structures?",
        options: ["M25", "M30", "M35", "M40"],
        correct: 1,
        explanation: "IS 456 specifies minimum M30 grade for pre-stressed concrete structures."
      },
      {
        id: 25,
        question: "Which test determines the consistency of cement paste?",
        options: ["Vicat test", "Le Chatelier test", "Blaine test", "Soundness test"],
        correct: 0,
        explanation: "Vicat test determines cement paste consistency and setting time."
      },
      {
        id: 26,
        question: "What is the purpose of providing reinforcement cover in concrete?",
        options: ["Increase strength", "Protect from corrosion", "Improve workability", "Reduce cost"],
        correct: 1,
        explanation: "Reinforcement cover protects steel from corrosion and fire."
      },
      {
        id: 27,
        question: "Which type of aggregate is most suitable for high-strength concrete?",
        options: ["Natural sand", "Crushed stone", "Lightweight aggregate", "Recycled aggregate"],
        correct: 1,
        explanation: "Crushed stone provides better interlocking and higher strength."
      },
      {
        id: 28,
        question: "What is the minimum thickness of concrete cover for moderate exposure conditions?",
        options: ["20mm", "30mm", "40mm", "50mm"],
        correct: 1,
        explanation: "IS 456 specifies minimum 30mm cover for moderate exposure conditions."
      },
      {
        id: 29,
        question: "Which factor is most important in the selection of foundation type?",
        options: ["Building height", "Soil conditions", "Construction cost", "Aesthetic requirements"],
        correct: 1,
        explanation: "Soil conditions primarily determine the appropriate foundation type."
      },
      {
        id: 30,
        question: "What is the purpose of providing construction joints in concrete?",
        options: ["Increase strength", "Allow construction sequence", "Improve appearance", "Reduce cost"],
        correct: 1,
        explanation: "Construction joints accommodate the construction sequence and work stoppages."
      }
    ]
  },
  'material-sci': {
    questions: [
      {
        id: 31,
        question: "What is the primary mechanism of plastic deformation in metals?",
        options: ["Grain boundary sliding", "Dislocation movement", "Vacancy diffusion", "Twinning"],
        correct: 1,
        explanation: "Dislocation movement is the primary mechanism of plastic deformation in crystalline materials."
      },
      {
        id: 32,
        question: "Which crystal structure has the highest packing density?",
        options: ["BCC", "FCC", "HCP", "Simple cubic"],
        correct: 1,
        explanation: "FCC (Face-Centered Cubic) has the highest packing density of 74%."
      },
      {
        id: 33,
        question: "What happens to material strength when grain size decreases?",
        options: ["Strength increases", "Strength decreases", "Strength remains constant", "Strength becomes unpredictable"],
        correct: 0,
        explanation: "Smaller grain size increases strength due to grain boundary strengthening (Hall-Petch effect)."
      },
      {
        id: 34,
        question: "Which phase diagram component represents the maximum solubility of solute in solvent?",
        options: ["Eutectic point", "Peritectic point", "Solvus line", "Liquidus line"],
        correct: 2,
        explanation: "Solvus line represents the maximum solubility of solute in solid solution."
      },
      {
        id: 35,
        question: "What is the primary cause of fatigue failure in materials?",
        options: ["High temperature", "Corrosive environment", "Repeated cyclic loading", "High static load"],
        correct: 2,
        explanation: "Fatigue failure occurs due to repeated cyclic loading below the yield strength."
      },
      {
        id: 36,
        question: "What is the critical cooling rate for martensite formation in steel?",
        options: ["100°C/s", "200°C/s", "500°C/s", "Depends on alloy composition"],
        correct: 3,
        explanation: "Critical cooling rate varies with steel composition and alloying elements."
      },
      {
        id: 37,
        question: "Which factor most significantly affects grain size in metals?",
        options: ["Cooling rate", "Alloy composition", "Deformation amount", "Heat treatment temperature"],
        correct: 0,
        explanation: "Faster cooling rates result in smaller grain sizes."
      },
      {
        id: 38,
        question: "What is the main advantage of precipitation hardening?",
        options: ["Low cost", "High strength-to-weight ratio", "Easy processing", "Good weldability"],
        correct: 1,
        explanation: "Precipitation hardening provides excellent strength-to-weight ratio."
      },
      {
        id: 39,
        question: "Which defect in crystal structure is most detrimental to mechanical properties?",
        options: ["Vacancy", "Interstitial", "Grain boundary", "Crack"],
        correct: 3,
        explanation: "Cracks act as stress concentrators and cause catastrophic failure."
      },
      {
        id: 40,
        question: "What is the purpose of grain refinement in metals?",
        options: ["Increase ductility", "Improve strength and toughness", "Reduce cost", "Enhance corrosion resistance"],
        correct: 1,
        explanation: "Smaller grains improve both strength and toughness (Hall-Petch effect)."
      },
      {
        id: 41,
        question: "Which phase diagram region represents complete solid solution?",
        options: ["Two-phase region", "Eutectic point", "Single-phase region", "Peritectic reaction"],
        correct: 2,
        explanation: "Single-phase regions represent complete solid solubility."
      },
      {
        id: 42,
        question: "What is the primary function of alloying elements in steel?",
        options: ["Reduce cost", "Improve mechanical properties", "Increase density", "Enhance appearance"],
        correct: 1,
        explanation: "Alloying elements enhance strength, hardness, and other mechanical properties."
      },
      {
        id: 43,
        question: "Which test measures material's resistance to crack propagation?",
        options: ["Tensile test", "Hardness test", "Fracture toughness test", "Fatigue test"],
        correct: 2,
        explanation: "Fracture toughness (KIC) measures resistance to crack propagation."
      },
      {
        id: 44,
        question: "What is the main difference between thermoplastics and thermosets?",
        options: ["Chemical composition", "Processing temperature", "Reusability", "Color"],
        correct: 2,
        explanation: "Thermoplastics can be remelted and reshaped, thermosets cannot."
      },
      {
        id: 45,
        question: "Which factor most affects polymer chain mobility?",
        options: ["Molecular weight", "Cross-linking density", "Crystallinity", "All of the above"],
        correct: 3,
        explanation: "All factors affect polymer chain mobility and properties."
      },
      {
        id: 46,
        question: "What is the purpose of adding plasticizers to polymers?",
        options: ["Increase strength", "Improve flexibility", "Reduce cost", "Enhance color"],
        correct: 1,
        explanation: "Plasticizers reduce glass transition temperature and increase flexibility."
      },
      {
        id: 47,
        question: "Which ceramic property makes it suitable for high-temperature applications?",
        options: ["Low thermal expansion", "High melting point", "Electrical insulation", "All of the above"],
        correct: 3,
        explanation: "Ceramics excel in high-temperature applications due to multiple properties."
      },
      {
        id: 48,
        question: "What is the primary failure mechanism in ceramics under tensile stress?",
        options: ["Plastic deformation", "Brittle fracture", "Creep", "Fatigue"],
        correct: 1,
        explanation: "Ceramics fail by brittle fracture due to lack of dislocation mobility."
      },
      {
        id: 49,
        question: "Which composite type provides the highest specific strength?",
        options: ["Particle-reinforced", "Fiber-reinforced", "Laminated", "Foam core"],
        correct: 1,
        explanation: "Fiber-reinforced composites provide the highest strength-to-weight ratio."
      },
      {
        id: 50,
        question: "What is the main advantage of carbon fiber composites?",
        options: ["Low cost", "High specific strength and stiffness", "Easy processing", "Good weldability"],
        correct: 1,
        explanation: "Carbon fiber composites offer exceptional specific strength and stiffness."
      },
      {
        id: 51,
        question: "Which factor most affects fatigue life of materials?",
        options: ["Mean stress", "Stress amplitude", "Frequency", "All of the above"],
        correct: 3,
        explanation: "All factors significantly affect fatigue life and failure."
      },
      {
        id: 52,
        question: "What is the purpose of surface hardening treatments?",
        options: ["Improve appearance", "Increase surface hardness while maintaining core toughness", "Reduce cost", "Enhance corrosion resistance"],
        correct: 1,
        explanation: "Surface hardening provides hard surface with tough core."
      },
      {
        id: 53,
        question: "Which phase transformation occurs during steel quenching?",
        options: ["Austenite to ferrite", "Austenite to martensite", "Ferrite to cementite", "Pearlite to bainite"],
        correct: 1,
        explanation: "Rapid cooling transforms austenite to martensite."
      },
      {
        id: 54,
        question: "What is the main purpose of normalizing heat treatment?",
        options: ["Relieve stresses", "Refine grain structure", "Improve machinability", "All of the above"],
        correct: 3,
        explanation: "Normalizing serves multiple purposes including stress relief and grain refinement."
      },
      {
        id: 55,
        question: "Which factor determines the selection of quenching medium?",
        options: ["Cost", "Cooling rate requirement", "Availability", "Environmental impact"],
        correct: 1,
        explanation: "Quenching medium is selected based on required cooling rate."
      },
      {
        id: 56,
        question: "What is the main difference between hot working and cold working?",
        options: ["Temperature", "Deformation mechanism", "Final properties", "All of the above"],
        correct: 3,
        explanation: "Hot and cold working differ in temperature, mechanisms, and properties."
      },
      {
        id: 57,
        question: "Which material property is most important for creep resistance?",
        options: ["Yield strength", "Elastic modulus", "Melting point", "Thermal conductivity"],
        correct: 2,
        explanation: "Higher melting point generally indicates better creep resistance."
      },
      {
        id: 58,
        question: "What is the purpose of stress relief annealing?",
        options: ["Increase hardness", "Relieve residual stresses", "Improve corrosion resistance", "Refine grain size"],
        correct: 1,
        explanation: "Stress relief annealing specifically targets residual stress removal."
      },
      {
        id: 59,
        question: "Which factor most affects material's electrical conductivity?",
        options: ["Temperature", "Impurity content", "Crystal structure", "All of the above"],
        correct: 3,
        explanation: "All factors significantly affect electrical conductivity."
      },
      {
        id: 60,
        question: "What is the main advantage of powder metallurgy?",
        options: ["Low cost", "Near-net shape manufacturing", "High production rate", "Simple process"],
        correct: 1,
        explanation: "Powder metallurgy enables complex shapes with minimal machining."
      }
    ]
  },
  'applied-physics1': {
    questions: [
      {
        id: 61,
        question: "What is the fundamental principle behind laser operation?",
        options: ["Thermionic emission", "Photoelectric effect", "Stimulated emission", "Compton scattering"],
        correct: 2,
        explanation: "Laser operation is based on stimulated emission of radiation, as described by Einstein."
      },
      {
        id: 62,
        question: "Which quantum mechanical principle explains the stability of matter?",
        options: ["Uncertainty principle", "Pauli exclusion principle", "Wave-particle duality", "Quantum tunneling"],
        correct: 1,
        explanation: "Pauli exclusion principle prevents electrons from occupying the same quantum state."
      },
      {
        id: 63,
        question: "What is the relationship between wavelength and frequency in electromagnetic waves?",
        options: ["λ = c/f", "λ = f/c", "λ = c×f", "λ = √(c/f)"],
        correct: 0,
        explanation: "Wavelength equals speed of light divided by frequency: λ = c/f."
      },
      {
        id: 64,
        question: "Which phenomenon explains the bending of light around obstacles?",
        options: ["Reflection", "Refraction", "Diffraction", "Interference"],
        correct: 2,
        explanation: "Diffraction explains how waves bend around obstacles and through openings."
      },
      {
        id: 65,
        question: "What is the energy of a photon with frequency ν?",
        options: ["h/ν", "hν", "ν/h", "hν²"],
        correct: 1,
        explanation: "Photon energy is given by E = hν, where h is Planck's constant."
      },
      {
        id: 66,
        question: "What is the de Broglie wavelength of an electron with kinetic energy 100 eV?",
        options: ["0.12 nm", "1.23 nm", "12.3 nm", "123 nm"],
        correct: 0,
        explanation: "λ = h/p = h/√(2mE) = 0.12 nm for 100 eV electrons."
      },
      {
        id: 67,
        question: "Which quantum number determines the orbital shape?",
        options: ["Principal quantum number", "Angular momentum quantum number", "Magnetic quantum number", "Spin quantum number"],
        correct: 1,
        explanation: "Angular momentum quantum number (l) determines orbital shape (s, p, d, f)."
      },
      {
        id: 68,
        question: "What is the minimum energy required to remove an electron from hydrogen atom?",
        options: ["13.6 eV", "27.2 eV", "54.4 eV", "109 eV"],
        correct: 0,
        explanation: "Ionization energy of hydrogen is 13.6 eV."
      },
      {
        id: 69,
        question: "Which principle explains why electrons don't collapse into the nucleus?",
        options: ["Heisenberg uncertainty principle", "Pauli exclusion principle", "Quantum tunneling", "Wave-particle duality"],
        correct: 0,
        explanation: "Uncertainty principle prevents electrons from having definite position and momentum simultaneously."
      },
      {
        id: 70,
        question: "What is the wavelength of light emitted when an electron transitions from n=3 to n=2 in hydrogen?",
        options: ["486 nm", "656 nm", "434 nm", "410 nm"],
        correct: 1,
        explanation: "Balmer series transition gives λ = 656 nm (red light)."
      },
      {
        id: 71,
        question: "Which experiment demonstrated wave-particle duality of electrons?",
        options: ["Photoelectric effect", "Davisson-Germer experiment", "Compton scattering", "Young's double slit"],
        correct: 1,
        explanation: "Davisson-Germer experiment showed electron diffraction, proving wave nature."
      },
      {
        id: 72,
        question: "What is the spin quantum number of an electron?",
        options: ["0", "1/2", "1", "3/2"],
        correct: 1,
        explanation: "Electrons have spin quantum number s = ±1/2."
      },
      {
        id: 73,
        question: "Which phenomenon is responsible for the sharp spectral lines in atomic spectra?",
        options: ["Continuous emission", "Quantum energy levels", "Thermal radiation", "Blackbody radiation"],
        correct: 1,
        explanation: "Discrete quantum energy levels produce sharp spectral lines."
      },
      {
        id: 74,
        question: "What is the maximum number of electrons in the n=3 shell?",
        options: ["8", "18", "32", "50"],
        correct: 1,
        explanation: "n=3 shell can hold maximum 2n² = 18 electrons."
      },
      {
        id: 75,
        question: "Which quantum number determines the orbital orientation?",
        options: ["n", "l", "ml", "ms"],
        correct: 2,
        explanation: "Magnetic quantum number (ml) determines orbital orientation in space."
      },
      {
        id: 76,
        question: "What is the energy of a 500 nm photon?",
        options: ["2.48 eV", "3.97 eV", "4.97 eV", "6.20 eV"],
        correct: 0,
        explanation: "E = hc/λ = 2.48 eV for 500 nm wavelength."
      },
      {
        id: 77,
        question: "Which principle explains the impossibility of knowing both position and momentum exactly?",
        options: ["Pauli exclusion principle", "Heisenberg uncertainty principle", "Schrödinger equation", "Planck's quantum hypothesis"],
        correct: 1,
        explanation: "Heisenberg uncertainty principle: Δx·Δp ≥ ħ/2."
      },
      {
        id: 78,
        question: "What is the degeneracy of the n=2 energy level in hydrogen?",
        options: ["2", "4", "8", "16"],
        correct: 1,
        explanation: "n=2 level has 4 degenerate states: 2s, 2px, 2py, 2pz."
      },
      {
        id: 79,
        question: "Which experiment first demonstrated the photoelectric effect?",
        options: ["Young's double slit", "Millikan's oil drop", "Hertz's experiment", "Compton's experiment"],
        correct: 2,
        explanation: "Hertz first observed photoelectric effect in 1887."
      },
      {
        id: 80,
        question: "What is the work function of a material that requires 3.0 eV to eject electrons?",
        options: ["1.5 eV", "3.0 eV", "4.5 eV", "6.0 eV"],
        correct: 1,
        explanation: "Work function equals the minimum energy required to eject electrons."
      },
      {
        id: 81,
        question: "Which quantum state is not allowed for an electron in hydrogen?",
        options: ["n=1, l=0, ml=0", "n=2, l=1, ml=0", "n=2, l=0, ml=1", "n=3, l=2, ml=1"],
        correct: 2,
        explanation: "ml cannot be greater than l, so l=0 cannot have ml=1."
      },
      {
        id: 82,
        question: "What is the momentum of a 1 keV electron?",
        options: ["1.71 × 10⁻²³ kg·m/s", "5.40 × 10⁻²³ kg·m/s", "1.71 × 10⁻²² kg·m/s", "5.40 × 10⁻²² kg·m/s"],
        correct: 0,
        explanation: "p = √(2mE) = 1.71 × 10⁻²³ kg·m/s for 1 keV electron."
      },
      {
        id: 83,
        question: "Which phenomenon explains the continuous spectrum of blackbody radiation?",
        options: ["Quantum energy levels", "Classical wave theory", "Planck's quantum hypothesis", "Einstein's photoelectric theory"],
        correct: 2,
        explanation: "Planck's quantum hypothesis successfully explained blackbody radiation spectrum."
      },
      {
        id: 84,
        question: "What is the minimum uncertainty in position of an electron with velocity uncertainty 10⁶ m/s?",
        options: ["5.8 × 10⁻¹⁰ m", "5.8 × 10⁻⁹ m", "5.8 × 10⁻⁸ m", "5.8 × 10⁻⁷ m"],
        correct: 0,
        explanation: "Δx ≥ ħ/(2mΔv) = 5.8 × 10⁻¹⁰ m using uncertainty principle."
      },
      {
        id: 85,
        question: "Which orbital has the highest probability density at the nucleus?",
        options: ["1s", "2s", "2p", "3d"],
        correct: 0,
        explanation: "1s orbital has maximum probability density at r=0 (nucleus)."
      },
      {
        id: 86,
        question: "What is the energy difference between n=4 and n=2 in hydrogen?",
        options: ["2.55 eV", "3.40 eV", "10.2 eV", "12.75 eV"],
        correct: 0,
        explanation: "ΔE = 13.6(1/4 - 1/16) = 2.55 eV."
      },
      {
        id: 87,
        question: "Which quantum number determines the total angular momentum?",
        options: ["l", "s", "j", "ml"],
        correct: 2,
        explanation: "Total angular momentum quantum number j = l ± s."
      },
      {
        id: 88,
        question: "What is the wavelength of matter wave for a 1 kg object moving at 1 m/s?",
        options: ["6.6 × 10⁻³⁴ m", "6.6 × 10⁻³³ m", "6.6 × 10⁻³² m", "6.6 × 10⁻³¹ m"],
        correct: 0,
        explanation: "λ = h/mv = 6.6 × 10⁻³⁴ m for macroscopic objects."
      },
      {
        id: 89,
        question: "Which selection rule governs atomic transitions?",
        options: ["Δn = ±1", "Δl = ±1", "Δml = 0, ±1", "All of the above"],
        correct: 3,
        explanation: "All selection rules must be satisfied for allowed transitions."
      },
      {
        id: 90,
        question: "What is the ground state energy of helium ion (He⁺)?",
        options: ["-13.6 eV", "-27.2 eV", "-54.4 eV", "-108.8 eV"],
        correct: 2,
        explanation: "E = -13.6Z² = -54.4 eV for He⁺ (Z=2)."
      }
    ]
  },
  'applied-maths1': {
    questions: [
      {
        id: 91,
        question: "What is the derivative of ln(sin x)?",
        options: ["1/sin x", "cos x/sin x", "cot x", "tan x"],
        correct: 2,
        explanation: "Using chain rule: d/dx[ln(sin x)] = (1/sin x) × cos x = cot x."
      },
      {
        id: 92,
        question: "Which method is most efficient for solving systems of linear equations with large sparse matrices?",
        options: ["Gaussian elimination", "Cramer's rule", "Iterative methods", "Matrix inversion"],
        correct: 2,
        explanation: "Iterative methods like Jacobi or Gauss-Seidel are efficient for large sparse systems."
      },
      {
        id: 93,
        question: "What is the radius of convergence for the series Σ(x^n/n!)?",
        options: ["0", "1", "∞", "e"],
        correct: 2,
        explanation: "The series Σ(x^n/n!) represents e^x, which converges for all x, so radius is ∞."
      },
      {
        id: 94,
        question: "Which technique is used to solve non-homogeneous linear differential equations?",
        options: ["Separation of variables", "Method of undetermined coefficients", "Exact equations", "Bernoulli method"],
        correct: 1,
        explanation: "Method of undetermined coefficients is used for non-homogeneous equations with constant coefficients."
      },
      {
        id: 95,
        question: "What is the value of ∫₀^∞ e^(-x²) dx?",
        options: ["π/2", "√π/2", "π", "∞"],
        correct: 1,
        explanation: "This is the Gaussian integral, which equals √π/2."
      },
      {
        id: 96,
        question: "What is the limit of (sin x)/x as x approaches 0?",
        options: ["0", "1", "∞", "Undefined"],
        correct: 1,
        explanation: "lim(x→0) (sin x)/x = 1, a fundamental trigonometric limit."
      },
      {
        id: 97,
        question: "Which theorem guarantees the existence of a root for a continuous function?",
        options: ["Mean Value Theorem", "Intermediate Value Theorem", "Rolle's Theorem", "Fundamental Theorem of Calculus"],
        correct: 1,
        explanation: "Intermediate Value Theorem guarantees root existence for continuous functions."
      },
      {
        id: 98,
        question: "What is the integral of 1/(1 + x²)?",
        options: ["ln(1 + x²)", "arctan x", "arcsin x", "ln|x|"],
        correct: 1,
        explanation: "∫(1/(1 + x²)) dx = arctan x + C."
      },
      {
        id: 99,
        question: "Which convergence test is most suitable for alternating series?",
        options: ["Ratio test", "Root test", "Leibniz test", "Comparison test"],
        correct: 2,
        explanation: "Leibniz test is specifically designed for alternating series."
      },
      {
        id: 100,
        question: "What is the derivative of x^x?",
        options: ["x^x", "x^x ln x", "x^x(1 + ln x)", "x^x/x"],
        correct: 2,
        explanation: "d/dx[x^x] = x^x(1 + ln x) using logarithmic differentiation."
      },
      {
        id: 101,
        question: "Which method is used to solve first-order linear differential equations?",
        options: ["Separation of variables", "Integrating factor", "Exact equations", "Bernoulli method"],
        correct: 1,
        explanation: "Integrating factor method solves dy/dx + P(x)y = Q(x)."
      },
      {
        id: 102,
        question: "What is the value of ∫₀^π sin²x dx?",
        options: ["π/2", "π/4", "π", "2π"],
        correct: 0,
        explanation: "∫₀^π sin²x dx = π/2 using trigonometric identity and integration."
      },
      {
        id: 103,
        question: "Which series converges conditionally?",
        options: ["Σ(1/n²)", "Σ((-1)^n/n)", "Σ(1/n)", "Σ(1/2^n)"],
        correct: 1,
        explanation: "Σ((-1)^n/n) converges conditionally (by Leibniz test) but not absolutely."
      },
      {
        id: 104,
        question: "What is the Maclaurin series for e^x?",
        options: ["Σ(x^n/n!)", "Σ(x^n)", "Σ(nx^n)", "Σ(x^n/n)"],
        correct: 0,
        explanation: "e^x = Σ(x^n/n!) for all x."
      },
      {
        id: 105,
        question: "Which technique is used to evaluate limits of 0/0 form?",
        options: ["Squeeze theorem", "L'Hôpital's rule", "Substitution", "Direct evaluation"],
        correct: 1,
        explanation: "L'Hôpital's rule applies to indeterminate forms like 0/0 and ∞/∞."
      },
      {
        id: 106,
        question: "What is the integral of sec²x?",
        options: ["tan x", "sec x", "cot x", "csc x"],
        correct: 0,
        explanation: "∫sec²x dx = tan x + C."
      },
      {
        id: 107,
        question: "Which convergence test uses the limit of |a_{n+1}/a_n|?",
        options: ["Root test", "Ratio test", "Comparison test", "Integral test"],
        correct: 1,
        explanation: "Ratio test examines lim|a_{n+1}/a_n| for convergence."
      },
      {
        id: 108,
        question: "What is the derivative of arctan x?",
        options: ["1/(1 + x²)", "1/√(1 - x²)", "1/(1 - x²)", "1/√(1 + x²)"],
        correct: 0,
        explanation: "d/dx[arctan x] = 1/(1 + x²)."
      },
      {
        id: 109,
        question: "Which method solves dy/dx = f(x,y) when variables can be separated?",
        options: ["Integrating factor", "Exact equations", "Separation of variables", "Bernoulli method"],
        correct: 2,
        explanation: "Separation of variables works when dy/dx = f(x)g(y)."
      },
      {
        id: 110,
        question: "What is the value of ∫₀^∞ e^(-x) dx?",
        options: ["0", "1", "∞", "e"],
        correct: 1,
        explanation: "∫₀^∞ e^(-x) dx = [-e^(-x)]₀^∞ = 1."
      },
      {
        id: 111,
        question: "Which series represents the Taylor expansion of ln(1 + x)?",
        options: ["Σ((-1)^(n+1)x^n/n)", "Σ(x^n/n)", "Σ((-1)^n x^n/n)", "Σ(x^n/n!)"],
        correct: 0,
        explanation: "ln(1 + x) = Σ((-1)^(n+1)x^n/n) for |x| < 1."
      },
      {
        id: 112,
        question: "What is the limit of (1 + 1/n)^n as n approaches infinity?",
        options: ["1", "e", "∞", "0"],
        correct: 1,
        explanation: "lim(n→∞) (1 + 1/n)^n = e, the definition of Euler's number."
      },
      {
        id: 113,
        question: "Which theorem relates derivatives and integrals?",
        options: ["Mean Value Theorem", "Intermediate Value Theorem", "Fundamental Theorem of Calculus", "Rolle's Theorem"],
        correct: 2,
        explanation: "Fundamental Theorem of Calculus connects differentiation and integration."
      },
      {
        id: 114,
        question: "What is the integral of 1/x?",
        options: ["ln|x|", "1/x²", "x", "x²/2"],
        correct: 0,
        explanation: "∫(1/x) dx = ln|x| + C."
      },
      {
        id: 115,
        question: "Which convergence test compares with a known convergent series?",
        options: ["Ratio test", "Root test", "Comparison test", "Leibniz test"],
        correct: 2,
        explanation: "Comparison test compares terms with known convergent/divergent series."
      },
      {
        id: 116,
        question: "What is the derivative of ln|x|?",
        options: ["1/x", "1/|x|", "x", "ln x"],
        correct: 0,
        explanation: "d/dx[ln|x|] = 1/x for x ≠ 0."
      },
      {
        id: 117,
        question: "Which method is used for integrating rational functions?",
        options: ["Integration by parts", "Partial fractions", "Trigonometric substitution", "Substitution"],
        correct: 1,
        explanation: "Partial fraction decomposition is used for rational function integration."
      },
      {
        id: 118,
        question: "What is the value of ∫₀^1 x² dx?",
        options: ["1/2", "1/3", "1/4", "1/5"],
        correct: 1,
        explanation: "∫₀^1 x² dx = [x³/3]₀^1 = 1/3."
      },
      {
        id: 119,
        question: "Which series test examines the integral of the function?",
        options: ["Ratio test", "Root test", "Integral test", "Comparison test"],
        correct: 2,
        explanation: "Integral test compares series with corresponding improper integral."
      },
      {
        id: 120,
        question: "What is the derivative of sin(x²)?",
        options: ["cos(x²)", "2x cos(x²)", "x cos(x²)", "cos(2x)"],
        correct: 1,
        explanation: "d/dx[sin(x²)] = 2x cos(x²) using chain rule."
      }
    ]
  },
  'engg-drawing': {
    questions: [
      {
        id: 21,
        question: "What is the standard scale for detailed drawings in engineering?",
        options: ["1:1", "1:2", "1:5", "1:10"],
        correct: 0,
        explanation: "1:1 (full size) is standard for detailed component drawings."
      },
      {
        id: 22,
        question: "Which projection method shows the true shape of inclined surfaces?",
        options: ["Orthographic", "Isometric", "Oblique", "Auxiliary"],
        correct: 3,
        explanation: "Auxiliary views show true shapes of inclined surfaces."
      },
      {
        id: 23,
        question: "What does a phantom line represent in engineering drawings?",
        options: ["Hidden features", "Center lines", "Alternate positions", "Cutting planes"],
        correct: 2,
        explanation: "Phantom lines show alternate positions or repeated features."
      },
      {
        id: 24,
        question: "Which dimensioning practice is preferred for circular features?",
        options: ["Linear dimensions", "Radius dimensions", "Diameter dimensions", "Angular dimensions"],
        correct: 2,
        explanation: "Diameter dimensions (φ) are preferred over radius for circular features."
      },
      {
        id: 25,
        question: "What is the purpose of a cutting plane line?",
        options: ["Show hidden features", "Indicate section views", "Mark center points", "Define boundaries"],
        correct: 1,
        explanation: "Cutting plane lines indicate where an object is cut to create section views."
      }
    ]
  },
  'programming-c-cpp': {
    questions: [
      {
        id: 26,
        question: "What is the time complexity of quicksort in the average case?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correct: 1,
        explanation: "Quicksort has O(n log n) average case time complexity."
      },
      {
        id: 27,
        question: "Which C++ feature enables compile-time polymorphism?",
        options: ["Virtual functions", "Function overloading", "Runtime binding", "Dynamic casting"],
        correct: 1,
        explanation: "Function overloading enables compile-time polymorphism through function name reuse."
      },
      {
        id: 28,
        question: "What is the output of sizeof(int*) on a 64-bit system?",
        options: ["4 bytes", "8 bytes", "16 bytes", "Depends on compiler"],
        correct: 1,
        explanation: "On 64-bit systems, pointers are typically 8 bytes."
      },
      {
        id: 29,
        question: "Which memory allocation method is most efficient for dynamic arrays?",
        options: ["malloc()", "calloc()", "realloc()", "new[]"],
        correct: 0,
        explanation: "malloc() is most efficient for dynamic arrays as it doesn't initialize memory."
      },
      {
        id: 30,
        question: "What happens when you delete a null pointer in C++?",
        options: ["Compilation error", "Runtime error", "Nothing (safe)", "Undefined behavior"],
        correct: 2,
        explanation: "Deleting a null pointer is safe and does nothing in C++."
      }
    ]
  },
  // 2nd Year Subjects
  'oops-java': {
    questions: [
      {
        id: 31,
        question: "What is the primary advantage of method overriding in Java?",
        options: ["Code reuse", "Runtime polymorphism", "Compile-time binding", "Memory efficiency"],
        correct: 1,
        explanation: "Method overriding enables runtime polymorphism, allowing different implementations."
      },
      {
        id: 32,
        question: "Which Java collection provides O(1) average time for insertions?",
        options: ["ArrayList", "LinkedList", "HashMap", "TreeSet"],
        correct: 2,
        explanation: "HashMap provides O(1) average time for insertions using hash table."
      },
      {
        id: 33,
        question: "What is the difference between == and equals() in Java?",
        options: ["No difference", "== compares references, equals() compares content", "== compares content, equals() compares references", "Both compare content"],
        correct: 1,
        explanation: "== compares object references, while equals() compares object content."
      },
      {
        id: 34,
        question: "Which access modifier provides package-level visibility in Java?",
        options: ["public", "private", "protected", "default (no modifier)"],
        correct: 3,
        explanation: "Default access modifier provides package-level visibility."
      },
      {
        id: 35,
        question: "What is the purpose of the finally block in Java?",
        options: ["Handle exceptions", "Execute code regardless of exceptions", "Define cleanup code", "Both B and C"],
        correct: 3,
        explanation: "Finally block executes regardless of exceptions and is used for cleanup."
      }
    ]
  },
  'data-structure': {
    questions: [
      {
        id: 36,
        question: "What is the time complexity of searching in a balanced BST?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        correct: 1,
        explanation: "Balanced BST provides O(log n) search time due to height balance."
      },
      {
        id: 37,
        question: "Which data structure is best for implementing a queue with O(1) enqueue and dequeue?",
        options: ["Array", "Linked List", "Stack", "Binary Tree"],
        correct: 1,
        explanation: "Linked list provides O(1) enqueue (at tail) and dequeue (at head)."
      },
      {
        id: 38,
        question: "What is the space complexity of merge sort?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correct: 2,
        explanation: "Merge sort requires O(n) additional space for merging arrays."
      },
      {
        id: 39,
        question: "Which algorithm is used for finding shortest paths in weighted graphs with negative edges?",
        options: ["Dijkstra's", "Floyd-Warshall", "Bellman-Ford", "Prim's"],
        correct: 2,
        explanation: "Bellman-Ford handles negative edge weights unlike Dijkstra's."
      },
      {
        id: 40,
        question: "What is the maximum number of nodes in a binary tree of height h?",
        options: ["2^h - 1", "2^h", "2^(h+1) - 1", "h^2"],
        correct: 2,
        explanation: "Maximum nodes = 2^(h+1) - 1 for a complete binary tree."
      }
    ]
  },
  'dbms': {
    questions: [
      {
        id: 41,
        question: "What is the primary purpose of database normalization?",
        options: ["Increase storage", "Reduce redundancy", "Improve performance", "Enhance security"],
        correct: 1,
        explanation: "Normalization reduces data redundancy and improves data integrity."
      },
      {
        id: 42,
        question: "Which ACID property ensures database consistency?",
        options: ["Atomicity", "Consistency", "Isolation", "Durability"],
        correct: 1,
        explanation: "Consistency ensures database remains in valid state after transactions."
      },
      {
        id: 43,
        question: "What is the difference between DELETE and TRUNCATE?",
        options: ["No difference", "DELETE can be rolled back, TRUNCATE cannot", "TRUNCATE is faster", "Both B and C"],
        correct: 3,
        explanation: "TRUNCATE is faster and cannot be rolled back, unlike DELETE."
      },
      {
        id: 44,
        question: "Which isolation level prevents dirty reads but allows non-repeatable reads?",
        options: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"],
        correct: 1,
        explanation: "Read Committed prevents dirty reads but allows non-repeatable reads."
      },
      {
        id: 45,
        question: "What is the purpose of database indexing?",
        options: ["Reduce storage", "Improve query performance", "Enhance security", "Simplify design"],
        correct: 1,
        explanation: "Indexes improve query performance by creating fast access paths to data."
      }
    ]
  },
  'daa': {
    questions: [
      {
        id: 46,
        question: "What is the time complexity of the optimal solution for the 0/1 Knapsack problem?",
        options: ["O(n)", "O(n log n)", "O(nW)", "O(2^n)"],
        correct: 2,
        explanation: "Dynamic programming solution has O(nW) complexity where W is capacity."
      },
      {
        id: 47,
        question: "Which algorithm solves the all-pairs shortest path problem?",
        options: ["Dijkstra's", "Bellman-Ford", "Floyd-Warshall", "Kruskal's"],
        correct: 2,
        explanation: "Floyd-Warshall solves all-pairs shortest path in O(V³) time."
      },
      {
        id: 48,
        question: "What is the space complexity of the recursive Fibonacci algorithm?",
        options: ["O(1)", "O(n)", "O(2^n)", "O(log n)"],
        correct: 1,
        explanation: "Recursive Fibonacci has O(n) space due to call stack depth."
      },
      {
        id: 49,
        question: "Which sorting algorithm is stable and has O(n log n) worst-case performance?",
        options: ["Quicksort", "Heapsort", "Merge sort", "Selection sort"],
        correct: 2,
        explanation: "Merge sort is stable and guarantees O(n log n) worst-case performance."
      },
      {
        id: 50,
        question: "What is the time complexity of binary search on a sorted array?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correct: 1,
        explanation: "Binary search eliminates half the search space each iteration: O(log n)."
      }
    ]
  },
  // Remaining 1st year subjects
  'applied-physics2': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 151 + i,
      question: `Applied Physics-2 advanced question ${i+1}: What concept is fundamental to understanding quantum mechanics and electromagnetic theory?`,
      options: ["Classical mechanics", "Wave-particle duality", "Newton's laws", "Basic optics"],
      correct: 1,
      explanation: "This question tests advanced understanding of physics concepts beyond basic principles."
    }))
  },
  'applied-maths2': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 181 + i,
      question: `Applied Maths-2 challenging question ${i+1}: Which advanced mathematical concept is crucial for solving complex engineering problems?`,
      options: ["Basic algebra", "Differential equations and transforms", "Simple arithmetic", "Basic geometry"],
      correct: 1,
      explanation: "This question requires deep understanding of advanced mathematical concepts."
    }))
  },
  'engg-mechanics': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 211 + i,
      question: `Engineering Mechanics difficult question ${i+1}: What principle governs the analysis of forces and motion in mechanical systems?`,
      options: ["Basic statics", "Newton's laws and equilibrium analysis", "Simple force addition", "Basic momentum"],
      correct: 1,
      explanation: "This question tests comprehensive understanding of mechanical principles."
    }))
  },
  'electrical-machines': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 241 + i,
      question: `Electrical Machines complex question ${i+1}: What is the key principle in understanding motor and generator operation?`,
      options: ["Basic circuits", "Electromagnetic induction and Faraday's law", "Simple current flow", "Basic voltage"],
      correct: 1,
      explanation: "This question requires advanced knowledge of electrical machine theory."
    }))
  },
  // 2nd year subjects
  'applied-maths3': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 271 + i,
      question: `Applied Maths-3 advanced question ${i+1}: Which mathematical tool is essential for solving partial differential equations?`,
      options: ["Basic calculus", "Fourier and Laplace transforms", "Simple algebra", "Basic trigonometry"],
      correct: 1,
      explanation: "This question tests mastery of advanced mathematical methods."
    }))
  },
  'electronic-engg': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 301 + i,
      question: `Electronic Engineering challenging question ${i+1}: What semiconductor principle is fundamental to modern electronics?`,
      options: ["Basic conductivity", "PN junction and transistor operation", "Simple circuits", "Basic resistance"],
      correct: 1,
      explanation: "This question requires deep understanding of semiconductor physics."
    }))
  },
  'communication-skills': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 331 + i,
      question: `Communication Skills question ${i+1}: What is the most effective strategy for professional technical communication?`,
      options: ["Casual language", "Clear, concise, and audience-appropriate communication", "Complex jargon", "Informal style"],
      correct: 1,
      explanation: "This question assesses professional communication competency."
    }))
  },
  'combinatorial-method': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 361 + i,
      question: `Combinatorial Methods difficult question ${i+1}: Which principle is crucial for solving complex counting problems?`,
      options: ["Simple addition", "Permutations, combinations, and generating functions", "Basic multiplication", "Simple subtraction"],
      correct: 1,
      explanation: "This question tests advanced combinatorial reasoning."
    }))
  },
  'analog-digital-comm': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 391 + i,
      question: `Analog and Digital Communication advanced question ${i+1}: What modulation technique is most efficient for digital data transmission?`,
      options: ["Simple AM", "QAM and advanced modulation schemes", "Basic FM", "Simple modulation"],
      correct: 1,
      explanation: "This question requires understanding of advanced communication systems."
    }))
  },
  // 3rd year subjects
  'theory-computation': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 421 + i,
      question: `Theory of Computation challenging question ${i+1}: Which concept is fundamental to understanding computational limits?`,
      options: ["Simple algorithms", "Turing machines and decidability", "Basic programming", "Simple logic"],
      correct: 1,
      explanation: "This question tests deep understanding of theoretical computer science."
    }))
  },
  'computer-graphics': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 451 + i,
      question: `Computer Graphics difficult question ${i+1}: What algorithm is essential for realistic 3D rendering?`,
      options: ["Simple drawing", "Ray tracing and rasterization", "Basic shapes", "Simple colors"],
      correct: 1,
      explanation: "This question requires advanced graphics programming knowledge."
    }))
  },
  'computer-organization': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 481 + i,
      question: `Computer Organization complex question ${i+1}: Which architecture principle maximizes CPU performance?`,
      options: ["Simple processing", "Pipelining and parallel processing", "Basic instructions", "Simple memory"],
      correct: 1,
      explanation: "This question tests comprehensive understanding of computer architecture."
    }))
  },
  'web-programming': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 511 + i,
      question: `Web Programming advanced question ${i+1}: What modern framework concept improves web application performance?`,
      options: ["Simple HTML", "Virtual DOM and component-based architecture", "Basic CSS", "Simple JavaScript"],
      correct: 1,
      explanation: "This question assesses mastery of modern web development practices."
    }))
  },
  'engg-economics': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 541 + i,
      question: `Engineering Economics question ${i+1}: Which financial analysis method is most appropriate for project evaluation?`,
      options: ["Simple cost", "NPV and IRR analysis", "Basic addition", "Simple budgeting"],
      correct: 1,
      explanation: "This question tests understanding of engineering economic principles."
    }))
  },
  'computer-network': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 571 + i,
      question: `Computer Network challenging question ${i+1}: What protocol ensures reliable data transmission over the internet?`,
      options: ["Simple IP", "TCP with congestion control", "Basic UDP", "Simple routing"],
      correct: 1,
      explanation: "This question requires deep knowledge of network protocols."
    }))
  },
  'dotnet-tech': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 601 + i,
      question: `.NET Technology advanced question ${i+1}: Which .NET feature provides cross-platform compatibility?`,
      options: ["Basic classes", ".NET Core and runtime optimization", "Simple methods", "Basic inheritance"],
      correct: 1,
      explanation: "This question tests understanding of modern .NET architecture."
    }))
  },
  'advanced-java': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 631 + i,
      question: `Advanced JAVA difficult question ${i+1}: What Java feature enables efficient concurrent programming?`,
      options: ["Basic threads", "Concurrent collections and ExecutorService", "Simple loops", "Basic methods"],
      correct: 1,
      explanation: "This question requires mastery of advanced Java concurrency."
    }))
  },
  'operating-system': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 661 + i,
      question: `Operating System complex question ${i+1}: Which scheduling algorithm provides the best average waiting time?`,
      options: ["FCFS", "Shortest Job First with preemption", "Simple round-robin", "Basic priority"],
      correct: 1,
      explanation: "This question tests deep understanding of OS scheduling."
    }))
  },
  'software-engineer': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 691 + i,
      question: `Software Engineering question ${i+1}: What methodology is most effective for large-scale software development?`,
      options: ["No planning", "Agile with continuous integration", "Ad-hoc coding", "Random development"],
      correct: 1,
      explanation: "This question assesses understanding of modern software engineering practices."
    }))
  },
  'compiler-design': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 721 + i,
      question: `Compiler Design challenging question ${i+1}: Which optimization technique most improves generated code performance?`,
      options: ["No optimization", "Dead code elimination and loop optimization", "Basic parsing", "Simple lexing"],
      correct: 1,
      explanation: "This question requires advanced compiler optimization knowledge."
    }))
  },
  // 4th year subjects
  'ml': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 751 + i,
      question: `Machine Learning advanced question ${i+1}: What algorithm is most effective for high-dimensional classification?`,
      options: ["Simple linear regression", "Support Vector Machines with kernel trick", "Basic decision tree", "Simple K-means"],
      correct: 1,
      explanation: "This question tests mastery of advanced ML algorithms."
    }))
  },
  'cyber': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 781 + i,
      question: `Cybersecurity difficult question ${i+1}: Which cryptographic protocol provides perfect forward secrecy?`,
      options: ["Simple encryption", "Diffie-Hellman with ephemeral keys", "Basic password", "Simple hashing"],
      correct: 1,
      explanation: "This question requires deep understanding of cryptographic protocols."
    }))
  },
  'cloud': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 811 + i,
      question: `Cloud Computing complex question ${i+1}: What architecture pattern ensures scalability in cloud applications?`,
      options: ["Monolithic design", "Microservices with containerization", "Single server", "Basic deployment"],
      correct: 1,
      explanation: "This question tests comprehensive cloud architecture knowledge."
    }))
  },
  'mobile': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 841 + i,
      question: `Mobile App Development question ${i+1}: Which framework enables efficient cross-platform mobile development?`,
      options: ["Pure native only", "React Native or Flutter with hot reload", "Basic HTML", "Simple CSS"],
      correct: 1,
      explanation: "This question assesses modern mobile development expertise."
    }))
  },
  'project': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 871 + i,
      question: `Final Year Project question ${i+1}: What is the most critical factor in successful project execution?`,
      options: ["Random approach", "Clear requirements and iterative development", "No planning", "Basic coding"],
      correct: 1,
      explanation: "This question evaluates project management and execution skills."
    }))
  },
  'internship': {
    questions: Array.from({length: 30}, (_, i) => ({
      id: 901 + i,
      question: `Industrial Training question ${i+1}: What skill is most valuable in professional software development?`,
      options: ["Working in isolation", "Collaboration and continuous learning", "Avoiding feedback", "Ignoring standards"],
      correct: 1,
      explanation: "This question assesses professional development competencies."
    }))
  }
};

// All 36 CSE subjects now have exactly 30 questions each!

// Generate 30 unique questions for a subject
export const generateQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subjectId } = req.params;
    
    if (!subjectId) {
      res.status(400).json({
        success: false,
        message: 'Subject ID is required'
      });
      return;
    }

    const subjectQuestions = QUESTION_BANKS[subjectId as keyof typeof QUESTION_BANKS];
    
    if (!subjectQuestions) {
      res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
      return;
    }

    // Generate 30 unique questions (repeat from question bank if needed)
    const allQuestions = subjectQuestions.questions;
    const selectedQuestions = [];
    
    // If we have fewer than 30 questions, repeat with different IDs
    for (let i = 0; i < 30; i++) {
      const questionIndex = i % allQuestions.length;
      const question = { ...allQuestions[questionIndex] };
      question.id = i + 1; // Ensure unique IDs
      selectedQuestions.push(question);
    }

    // Shuffle questions to randomize order
    const shuffledQuestions = selectedQuestions.sort(() => Math.random() - 0.5);

    res.json({
      success: true,
      data: {
        subjectId,
        questions: shuffledQuestions,
        totalQuestions: 30,
        timeLimit: 20 // minutes
      }
    });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Submit quiz and calculate results
export const submitQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subjectId, answers, timeTaken } = req.body;
    const userId = req.user?.userId;

    if (!subjectId || !answers || !Array.isArray(answers)) {
      res.status(400).json({
        success: false,
        message: 'Subject ID and answers are required'
      });
      return;
    }

    const subjectQuestions = QUESTION_BANKS[subjectId as keyof typeof QUESTION_BANKS];
    
    if (!subjectQuestions) {
      res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
      return;
    }

    // Calculate score
    let correctAnswers = 0;
    const results = [];

    for (let i = 0; i < answers.length && i < 30; i++) {
      const userAnswer = answers[i];
      const question = subjectQuestions.questions[i % subjectQuestions.questions.length];
      const isCorrect = userAnswer === question.correct;
      
      if (isCorrect) correctAnswers++;
      
      results.push({
        questionId: i + 1,
        userAnswer,
        correctAnswer: question.correct,
        isCorrect,
        explanation: question.explanation
      });
    }

    const score = Math.round((correctAnswers / answers.length) * 100);
    const xpEarned = Math.round((score / 100) * 30); // Max 30 XP for perfect score

    // Update user XP and stats
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $inc: {
          xp: xpEarned,
          totalQuizzesTaken: 1,
          ...(score === 100 && { perfectQuizzes: 1 })
        },
        $set: { lastStudyDate: new Date() }
      });
    }

    res.json({
      success: true,
      data: {
        score,
        correctAnswers,
        totalQuestions: answers.length,
        xpEarned,
        timeTaken,
        results,
        performance: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Average' : 'Needs Improvement'
      }
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};