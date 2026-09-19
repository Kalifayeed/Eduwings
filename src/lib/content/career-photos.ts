export interface CareerPhoto {
  src: string;
  alt: string;
  title: string;
  author: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  changes: string;
}

export const careerPhotos: Record<string, CareerPhoto> = {
  pilot: {
    src: "/images/careers/pilot.webp",
    alt: "Boeing 787 flight deck with pilot seats, controls and instrument panels",
    title: "Boeing 787 cockpit.jpg",
    author: "dschwen",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Boeing_787_cockpit.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    changes: "Resized and converted to WebP; cropped responsively in the page layout.",
  },
  "cabin-crew": {
    src: "/images/careers/cabin-crew.webp",
    alt: "Flight attendant demonstrating safety procedures in an aircraft cabin",
    title: "Female flight attendant performing a pre-flight safety demonstration.jpg",
    author: "Miguel Discart",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Female_flight_attendant_performing_a_pre-flight_safety_demonstration.jpg",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    changes: "Resized and converted to WebP; cropped responsively in the page layout.",
  },
  "aircraft-maintenance-engineer": {
    src: "/images/careers/aircraft-maintenance-engineer.webp",
    alt: "Technicians working on the exposed engine of a light aircraft",
    title: "The master works. (5696109862).jpg",
    author: "Aleksandr Markin",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:The_master_works._(5696109862).jpg",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    changes: "Resized and converted to WebP; cropped responsively in the page layout.",
  },
  "air-traffic-controller": {
    src: "/images/careers/air-traffic-controller.webp",
    alt: "Illuminated air traffic control tower overlooking an airfield",
    title: "Yokota Air Base - Control Tower - 2011.jpg",
    author: "U.S. Air Force photo by Staff Sgt. Jonathan Steffen",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Yokota_Air_Base_-_Control_Tower_-_2011.jpg",
    license: "Public domain",
    licenseUrl: "https://commons.wikimedia.org/wiki/Commons:Public_domain",
    changes: "Resized and converted to WebP; cropped responsively in the page layout.",
  },
  "aeronautical-meteorologist": {
    src: "/images/careers/aeronautical-meteorologist.webp",
    alt: "Weather observation equipment at Sydney Airport",
    title: "Sydney Airport BOM weather station.jpg",
    author: "Orderinchaos",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Sydney_Airport_BOM_weather_station.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    changes: "Resized and converted to WebP; cropped responsively in the page layout.",
  },
  "aerospace-engineer": {
    src: "/images/careers/aerospace-engineer.webp",
    alt: "NASA engineer inspecting a scale aircraft model in a wind tunnel",
    title: "Quiet Supersonic Technology Preliminary Design Model.jpg",
    author: "NASA/Chris Giersch",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Quiet_Supersonic_Technology_Preliminary_Design_Model.jpg",
    license: "Public domain",
    licenseUrl: "https://commons.wikimedia.org/wiki/Commons:Public_domain",
    changes: "Resized and converted to WebP; cropped responsively in the page layout.",
  },
  "aircraft-designer": {
    src: "/images/careers/aircraft-designer.webp",
    alt: "MD-11 aircraft model mounted for aerodynamic wind-tunnel testing",
    title: "MD-11 12ft Wind Tunnel Test.jpg",
    author: "NASA Ames Research Center",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:MD-11_12ft_Wind_Tunnel_Test.jpg",
    license: "Public domain",
    licenseUrl: "https://commons.wikimedia.org/wiki/Commons:Public_domain",
    changes: "Resized and converted to WebP; cropped responsively in the page layout.",
  },
  "airport-manager": {
    src: "/images/careers/airport-manager.webp",
    alt: "Terminal approach at Jomo Kenyatta International Airport in Nairobi",
    title: "Jomo Kenyatta International Airport terminal building, 2025 (03).jpg",
    author: "Bahnfrend",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Jomo_Kenyatta_International_Airport_terminal_building,_2025_(03).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    changes: "Resized and converted to WebP; cropped responsively in the page layout.",
  },
  "ground-handling-specialist": {
    src: "/images/careers/ground-handling-specialist.webp",
    alt: "Ground crew marshaller signalling to an aircraft on the apron",
    title: "Aircraft marshaller.jpg",
    author: "Staff Sgt. P.J. Farlin",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Aircraft_marshaller.jpg",
    license: "Public domain",
    licenseUrl: "https://commons.wikimedia.org/wiki/Commons:Public_domain",
    changes: "Resized and converted to WebP; cropped responsively in the page layout.",
  },
  "aviation-security-officer": {
    src: "/images/careers/aviation-security-officer.webp",
    alt: "Passenger security checkpoint at Hakodate Airport",
    title: "Hakodate-Airport Security-check.jpg",
    author: "MaedaAkihiko",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Hakodate-Airport_Security-check.jpg",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    changes: "Resized and converted to WebP; cropped responsively in the page layout.",
  },
  "airline-operations-controller": {
    src: "/images/careers/airline-operations-controller.webp",
    alt: "Airport flight information boards displaying airline schedules",
    title: "Nombor Penerbangan yang dipaparkan di LTA Hong Kong, Julai 2018.jpg",
    author: "Meandkancil2020",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Nombor_Penerbangan_yang_dipaparkan_di_LTA_Hong_Kong,_Julai_2018.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    changes: "Resized and converted to WebP; cropped responsively in the page layout.",
  },
  "drone-pilot": {
    src: "/images/careers/drone-pilot.webp",
    alt: "NASA remote pilots using handheld controls during a drone test",
    title:
      "Justin Link, small uncrewed aircraft pilot, left, reads altitude data on a handheld display, as Justin Hall, Dale Reed Subscale Flight Research Laboratory chief pilot, flies NASA’s Alta-X drone near NASA’s Armst (AFRC2026-0179-10).jpg",
    author: "NASA Armstrong Flight Research Center / NASA/Ryan Kline",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Justin_Link,_small_uncrewed_aircraft_pilot,_left,_reads_altitude_data_on_a_handheld_display,_as_Justin_Hall,_Dale_Reed_Subscale_Flight_Research_Laboratory_chief_pilot,_flies_NASA%E2%80%99s_Alta-X_drone_near_NASA%E2%80%99s_Armst_(AFRC2026-0179-10).jpg",
    license: "Public domain",
    licenseUrl: "https://commons.wikimedia.org/wiki/Commons:Public_domain",
    changes: "Resized and converted to WebP; cropped responsively in the page layout.",
  },
  "avionics-technician": {
    src: "/images/careers/avionics-technician.webp",
    alt: "Avionics technician working beside an open aircraft electronics bay",
    title: "230320-F-LY743-2348 - Red Flag-Nells 23-2 Night Ops.jpg",
    author: "Senior Airman Zachary Rufus",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:230320-F-LY743-2348_-_Red_Flag-Nells_23-2_Night_Ops.jpg",
    license: "Public domain",
    licenseUrl: "https://commons.wikimedia.org/wiki/Commons:Public_domain",
    changes: "Resized and converted to WebP; cropped responsively in the page layout.",
  },
  "flight-dispatcher": {
    src: "/images/careers/flight-dispatcher.webp",
    alt: "Flight crew reviewing planning documents and weather information before departure",
    title: "25th FS sends assets to Wonju for Buddy Squadron 25-4 (8838058).jpg",
    author: "U.S. Air Force photo by Staff Sgt. Jason Cochran",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:25th_FS_sends_assets_to_Wonju_for_Buddy_Squadron_25-4_(8838058).jpg",
    license: "Public domain",
    licenseUrl: "https://commons.wikimedia.org/wiki/Commons:Public_domain",
    changes: "Resized and converted to WebP; cropped responsively in the page layout.",
  },
};

export function getCareerPhoto(slug: string): CareerPhoto {
  const photo = careerPhotos[slug];
  if (!photo) throw new Error(`Missing career photo: ${slug}`);
  return photo;
}
