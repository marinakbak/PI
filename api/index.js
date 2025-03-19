const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const { check, validationResult } = require("express-validator"); // Za bolju validaciju
const config = require("./config");

const app = express();
const port = 3000;

// Funkcija za izvršavanje SQL upita
async function query(sql, params) {
  try {
    const connection = await mysql.createConnection(config.db);
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error("Database error:", error.message);
    throw new Error("Database query failed.");
  }
}

// Middleware za parsiranje JSON i URL encoded podataka
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

// Ruta za dohvaćanje svih nastavnika (GET)
app.get("/api/NASTAVNIK", async function (req, res, next) {
  try {
    const result = await query("SELECT * FROM NASTAVNIK");

    res.json(result);
  } catch (err) {
    console.error("Greška u čitanju ", err.message);
    next(err);
  }
});

app.post("/api/NASTAVNIK", async function (req, res, next) {
  try {
    const result = await query(
      "INSERT INTO NASTAVNIK (ImePrezime_nastavnika, Predmet_nastavnika, Titula_nastavnika, Kontakt_nastavnika) VALUES (?, ?, ?, ?)",
      [
        req.body.ImePrezime_nastavnika,
        req.body.Predmet_nastavnika,
        req.body.Titula_nastavnika,
        req.body.Kontakt_nastavnika,
      ]
    );

    res.status(201).json(result); // Vrati status 201 za uspješan unos
  } catch (err) {
    console.error("Greška u ubacivanju:", err.message);
    res.status(500).json({ error: "Greška u ubacivanju podataka" });
  }
});

app.put("/api/NASTAVNIK", async function (req, res, next) {
  try {
    const result = await query(
      "UPDATE NASTAVNIK SET ImePrezime_nastavnika=:ImePrezime_nastavnika, Predmet_nastavnika=:Predmet_nastavnika, Titula_nastavnika=:Titula_nastavnika, Kontakt_nastavnika=:Kontakt_nastavnika WHERE ID_nastavnika=:ID_nastavnika",
      {
        ID_nastavnika: req.body.ID_nastavnika,
        ImePrezime_nastavnika: req.body.ImePrezime_nastavnika,
        Predmet_nastavnika: req.body.Predmet_nastavnika,
        Titula_nastavnika: req.body.Titula_nastavnika,
        Kontakt_nastavnika: req.body.Kontakt_nastavnika,
      }
    );

    res.json(result);
  } catch (err) {
    console.error("Greška u ažuriranju ", err.message);
    next(err);
  }
});

app.delete("/api/NASTAVNIK", async function (req, res, next) {
  console.log(req.body);
  try {
    const result = await query(
      "DELETE FROM NASTAVNIK WHERE ID_nastavnika=:ID_nastavnika",
      {
        ID_nastavnika: req.body.ID_nastavnika,
      }
    );

    res.json(result);
  } catch (err) {
    console.error("Greška u brisanju ", err.message);
    next(err);
  }
});

// Ruta za dohvaćanje svih polaznika (GET)
app.get("/api/POLAZNIK_TECAJA", async (req, res, next) => {
  try {
    const result = await query("SELECT * FROM POLAZNIK_TECAJA");
    res.json(result);
  } catch (err) {
    console.error("Greška u čitanju polaznika", err.message);
    next(err);
  }
});

// Ruta za dodavanje novog polaznika (POST)
app.post(
  "/api/POLAZNIK_TECAJA",
  [
    check("ImePrezime_polaznika")
      .notEmpty()
      .withMessage("Ime i prezime polaznika je obavezno"),
    check("Status_polaznika")
      .notEmpty()
      .withMessage("Stus polaznika je obavezno"),
    check("Adresa_polaznika").optional().isString(),
    check("Kontakt_polaznika").optional().isString(),
    check("Datum_upisa_polaznika")
      .optional()
      .isDate()
      .withMessage("Datum upisa mora biti validan datum"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await query(
        "INSERT INTO POLAZNIK_TECAJA (ImePrezime_polaznika, Status_polaznika, Adresa_polaznika, Kontakt_polaznika, Datum_upisa_polaznika) VALUES (?, ?, ?, ?, ?)",
        [
          req.body.ImePrezime_polaznika,
          req.body.Status_polaznika,
          req.body.Adresa_polaznika,
          req.body.Kontakt_polaznika,
          req.body.Datum_upisa_polaznika,
        ]
      );
      res.json({ message: "Polaznik uspješno dodan", result });
    } catch (err) {
      console.error("Greška u dodavanju polaznika", err.message);
      next(err);
    }
  }
);

// Ruta za ažuriranje postojećeg polaznika (PUT)
app.put(
  "/api/POLAZNIK_TECAJA",
  [
    check("ID_polaznika_tecaja")
      .notEmpty()
      .isInt()
      .withMessage("ID_polaznika_tecaja je obavezan i mora biti broj"),
    check("ImePrezime_polaznika").optional().isString(),
    check("Status_polaznika").optional().isString(),
    check("Adresa_polaznika").optional().isString(),
    check("Kontakt_polaznika").optional().isString(),
    check("Datum_upisa_polaznika").optional().isDate(),
  ],
  async (req, res, next) => {
    console.log("Podaci sa frontend-a", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await query(
        "UPDATE POLAZNIK_TECAJA SET ImePrezime_polaznika = ?, Status_polaznika = ?, Adresa_polaznika = ?, Kontakt_polaznika = ?, Datum_upisa_polaznika = ? WHERE ID_polaznika_tecaja = ?",
        [
          req.body.ImePrezime_polaznika,
          req.body.Status_polaznika,
          req.body.Adresa_polaznika,
          req.body.Kontakt_polaznika,
          req.body.Datum_upisa_polaznika,
          req.body.ID_polaznika_tecaja,
        ]
      );
      console.log("Rezultat SL upita:", result);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Polaznik nije pronađen" });
      }
      res.json({ message: "Polaznik uspješno ažuriran", result });
    } catch (err) {
      console.error("Greška u ažuriranju polaznika", err.message);
      next(err);
    }
  }
);

// Ruta za brisanje polaznika (DELETE)
app.delete(
  "/api/POLAZNIK_TECAJA",
  [
    check("ID_polaznika_tecaja")
      .notEmpty()
      .isInt()
      .withMessage("ID_polaznika_tecaja je obavezan i mora biti broj"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const [student] = await query(
        "SELECT ImePrezime_polaznika FROM POLAZNIK_TECAJA WHERE ID_polaznika_tecaja = ?",
        [req.body.ID_polaznika_tecaja]
      );

      if (!student) {
        return res.status(404).json({ message: "Polaznik nije pronađen" });
      }

      const result = await query(
        "DELETE FROM POLAZNIK_TECAJA WHERE ID_polaznika_tecaja = ?",
        [req.body.ID_polaznika_tecaja]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Polaznik nije pronađen" });
      }

      res.json({
        message: `Polaznik ${student.ImePrezime_polaznika} uspješno obrisan`,
        result,
      });
    } catch (err) {
      console.error("Greška u brisanju polaznika", err.message);
      next(err);
    }
  }
);

// Ruta za dohvaćanje svih tečajeva (GET)
app.get("/api/TECAJ", async function (req, res, next) {
  console.log("GET /api/TECAJ pozvan");
  try {
    const result = await query(
      "SELECT NASTAVNIK.ImePrezime_nastavnika as NASTAVNIK_ImePrezime_nastavnika, " +
        "TECAJ.ID_nastavnika, TECAJ.Naziv_tecaja, TECAJ.Opis_tecaja, TECAJ.Cijena_tecaja, TECAJ.Trajanje_tecaja, TECAJ.Sifra_tecaja " +
        "FROM TECAJ INNER JOIN NASTAVNIK ON TECAJ.ID_nastavnika = NASTAVNIK.ID_nastavnika"
    );
    console.log("Podaci dohvaćeni:", result);
    res.json(result);
  } catch (err) {
    console.error("Greška u čitanju:", err);
    next(err);
  }
});

// POST /api/TECAJ
app.post("/api/TECAJ", async function (req, res, next) {
  try {
    const result = await query(
      "INSERT INTO TECAJ (Naziv_tecaja, Opis_tecaja, Cijena_tecaja, Trajanje_tecaja, ID_nastavnika) " +
        "VALUES (?, ?, ?, ?, ?)",
      [
        req.body.Naziv_tecaja,
        req.body.Opis_tecaja,
        req.body.Cijena_tecaja,
        req.body.Trajanje_tecaja, // "20" ili "40"
        req.body.ID_nastavnika, // ID nastavnika kao FK
      ]
    );

    res.status(201).json(result); // Vrati status 201 za uspješan unos
  } catch (err) {
    console.error("Greška u ubacivanju:", err.message);
    res.status(500).json({ error: "Greška u ubacivanju podataka" });
  }
});

// PUT /api/TECAJ
app.put("/api/TECAJ", async function (req, res, next) {
  try {
    const result = await query(
      "UPDATE TECAJ " +
        "SET Naziv_tecaja=:Naziv_tecaja, Opis_tecaja=:Opis_tecaja, Cijena_tecaja=:Cijena_tecaja, Trajanje_tecaja=:Trajanje_tecaja, ID_nastavnika=:ID_nastavnika " +
        "WHERE Sifra_tecaja=:Sifra_tecaja",
      {
        Sifra_tecaja: req.body.Sifra_tecaja, // ID tečaja koji se ažurira
        Naziv_tecaja: req.body.Naziv_tecaja,
        Opis_tecaja: req.body.Opis_tecaja,
        Cijena_tecaja: req.body.Cijena_tecaja,
        Trajanje_tecaja: req.body.Trajanje_tecaja, // "20" ili "40"
        ID_nastavnika: req.body.ID_nastavnika, // ID nastavnika koji je vezan za tečaj
      }
    );

    res.json(result);
  } catch (err) {
    console.error("Greška u ažuriranju ", err.message);
    next(err);
  }
});

// DELETE /api/TECAJ
app.delete("/api/TECAJ", async function (req, res, next) {
  console.log(req.body);
  try {
    const result = await query(
      "DELETE FROM TECAJ WHERE Sifra_tecaja=:Sifra_tecaja",
      {
        Sifra_tecaja: req.body.Sifra_tecaja, // ID tečaja koji se briše
      }
    );

    res.json(result);
  } catch (err) {
    console.error("Greška u brisanju ", err.message);
    next(err);
  }
});

// Ruta za dohvaćanje svih ispitnih polaganja (GET)
app.get("/api/ISPITNO_POLAGANJE", async function (req, res, next) {
  try {
    const result = await query(`
      SELECT
  ISPITNO_POLAGANJE.Datum_polaganja,
  ISPITNO_POLAGANJE.Ocjena,
  POLAZNIK_TECAJA.ImePrezime_polaznika,
  TECAJ.Naziv_tecaja
FROM ISPITNO_POLAGANJE
INNER JOIN POLAZNIK_TECAJA
  ON ISPITNO_POLAGANJE.ID_polaznika_tecaja = POLAZNIK_TECAJA.ID_polaznika_tecaja
INNER JOIN TECAJ
  ON ISPITNO_POLAGANJE.Sifra_tecaja = TECAJ.Sifra_tecaja
ORDER BY Datum_polaganja DESC;

    `);
    res.json(result);
  } catch (err) {
    console.error("Greška u dohvaćanju ispitnih polaganja", err.message);
    next(err);
  }
});

app.post("/api/ISPITNO_POLAGANJE", async function (req, res, next) {
  try {
    const result = await query(
      "INSERT INTO ISPITNO_POLAGANJE (Datum_polaganja, Ocjena, Sifra_tecaja, ID_polaznika_tecaja) " +
        "VALUES (?, ?, ?, ?)",
      [
        req.body.Datum_polaganja,
        req.body.Ocjena,
        req.body.Sifra_tecaja,
        req.body.ID_polaznika_tecaja,
      ]
    );
    res.status(201).json(result);
  } catch (err) {
    console.error("Greška u ubacivanju:", err.message);
    res.status(500).json({ error: "Greška u ubacivanju podataka" });
  }
});

app.put("/api/ISPITNO_POLAGANJE", async function (req, res, next) {
  try {
    const result = await query(
      "UPDATE ISPITNO_POLAGANJE SET Datum_polaganja=?, Ocjena=?, Sifra_tecaja=?, ID_polaznika_tecaja=? WHERE Sifra_polaganja=?",
      [
        req.body.Datum_polaganja,
        req.body.Ocjena,
        req.body.Sifra_tecaja,
        req.body.ID_polaznika_tecaja,
        req.body.Sifra_polaganja,
      ]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json(result);
  } catch (err) {
    console.error("Greška u ažuriranju:", err.message);
    next(err);
  }
});

app.delete("/api/ISPITNO_POLAGANJE", async function (req, res, next) {
  try {
    const result = await query(
      "DELETE FROM ISPITNO_POLAGANJE WHERE Sifra_polaganja=?",
      [req.body.Sifra_polaganja]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json(result);
  } catch (err) {
    console.error("Greška u brisanju:", err.message);
    next(err);
  }
});

app.get("/api/UPLATE", async function (req, res, next) {
  try {
    const result = await query(`
      SELECT
        UPLATE.ID_uplate,
        UPLATE.Iznos_uplate,
        UPLATE.Datum_uplate,
        POLAZNIK_TECAJA.ImePrezime_polaznika,
        TECAJ.Naziv_tecaja
      FROM UPLATE
      INNER JOIN POLAZNIK_TECAJA
        ON UPLATE.ID_polaznika_tecaja = POLAZNIK_TECAJA.ID_polaznika_tecaja
      INNER JOIN TECAJ
        ON UPLATE.Sifra_tecaja = TECAJ.Sifra_tecaja
      ORDER BY Datum_uplate DESC;
    `);
    res.json(result);
  } catch (err) {
    console.error("Greška u dohvaćanju uplata:", err.message);
    next(err);
  }
});

app.post("/api/UPLATE", async function (req, res, next) {
  try {
    const result = await query(
      "INSERT INTO UPLATE (Iznos_uplate, Datum_uplate, ID_polaznika_tecaja, Sifra_tecaja) " +
        "VALUES (?, ?, ?, ?)",
      [
        req.body.Iznos_uplate,
        req.body.Datum_uplate,
        req.body.ID_polaznika_tecaja,
        req.body.Sifra_tecaja,
      ]
    );
    res.status(201).json(result);
  } catch (err) {
    console.error("Greška u dodavanju uplate:", err.message);
    res.status(500).json({ error: "Greška u ubacivanju podataka" });
  }
});
app.get("/api/IZVJESCA/UPLATE", async function (req, res, next) {
  try {
    const result = await query(`
      SELECT
        T.Naziv_tecaja,
        COUNT(U.ID_uplate) AS Broj_uplata,
        SUM(U.Iznos_uplate) AS Ukupan_iznos,
        MAX(U.Datum_uplate) AS Zadnja_uplata
      FROM UPLATE U
      JOIN TECAJ T ON U.Sifra_tecaja = T.Sifra_tecaja
      GROUP BY T.Naziv_tecaja;
    `);
    res.json(result);
  } catch (err) {
    console.error("Greška u dohvaćanju izvješća", err.message);
    next(err);
  }
});

app.get("/api/IZVJESCA/ISPITNO_POLAGANJE", async function (req, res, next) {
  try {
    const result = await query(`
      SELECT
        P.ImePrezime_polaznika,
        COUNT(I.Ocjena) AS Broj_polozenih_ispita,
        ROUND(AVG(I.Ocjena), 2) AS Prosjecna_ocjena
      FROM ISPITNO_POLAGANJE I
      JOIN POLAZNIK_TECAJA P ON I.ID_polaznika_tecaja = P.ID_polaznika_tecaja
      WHERE I.Ocjena >= 2
      GROUP BY P.ImePrezime_polaznika;
    `);
    res.json(result);
  } catch (err) {
    console.error("Greška u dohvaćanju izvješća", err.message);
    next(err);
  }
});

app.get("/api/IZVJESCA/NASTAVNIK", async function (req, res, next) {
  try {
    const result = await query(`
      SELECT
        N.ImePrezime_nastavnika,
        COUNT(T.Sifra_tecaja) AS Broj_tecajeva
      FROM TECAJ T
      JOIN NASTAVNIK N ON T.ID_nastavnika = N.ID_nastavnika
      GROUP BY N.ImePrezime_nastavnika;
    `);
    res.json(result);
  } catch (err) {
    console.error("Greška u dohvaćanju izvješća", err.message);
    next(err);
  }
});

app.get("/api/IZVJESCA/polaznici_ne_polozili", async function (req, res, next) {
  try {
    const result = await query(`
      SELECT
        P.ImePrezime_polaznika,
        T.Naziv_tecaja,
        I.Ocjena
      FROM ISPITNO_POLAGANJE I
      JOIN POLAZNIK_TECAJA P ON I.ID_polaznika_tecaja = P.ID_polaznika_tecaja
      JOIN TECAJ T ON I.Sifra_tecaja = T.Sifra_tecaja
      WHERE I.Ocjena < 2;
    `);

    res.json(result);
  } catch (err) {
    console.error("Greška u dohvaćanju izvješća", err.message);
    next(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
