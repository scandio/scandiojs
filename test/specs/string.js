describe("A suite testing the string functions", function() {
   describe("tests on string capitalization", function() {
      it("should have mixed in the module on namespace 'string'", function() {
         expect(Scandio.string).toBeDefined();
      });

      it("should properly capitalize strings", function() {
         expect(Scandio.string.capitalize).toEqual(jasmine.any(Function));

         expect(Scandio.string.capitalize("yAy")).toEqual("Yay");
      });

      it("should not capitalize every word", function() {
         expect(Scandio.string.capitalize("yAy yay yay")).toEqual("Yay yay yay");
      });
   });

   describe("tests on converting a string to lowercase", function() {
      it("should properly lowercase strings", function() {
         expect(Scandio.string.lower).toEqual(jasmine.any(Function));

         expect(Scandio.string.lower("yAy")).toEqual("yay");
      });

      it("should lowercase every word in a sentence", function() {
         expect(Scandio.string.lower("yAy yay yay")).toEqual("yay yay yay");
      });
   });

   describe("tests on cleanin up a string (freeing it from mess everywhere)", function() {
      it("should properly remove mess from the string's start", function() {
         expect(Scandio.string.clean).toEqual(jasmine.any(Function));

         expect(Scandio.string.clean("    Scandio GmbH")).toEqual("Scandio GmbH");
      });

      it("should properly remove mess from the string's end", function() {
         expect(Scandio.string.clean).toEqual(jasmine.any(Function));

         expect(Scandio.string.clean("Scandio GmbH    ")).toEqual("Scandio GmbH");
      });

      it("should properly remove mess from the string's end and start", function() {
         expect(Scandio.string.clean).toEqual(jasmine.any(Function));

         expect(Scandio.string.clean("    Scandio GmbH    ")).toEqual("Scandio GmbH");
      });

      it("should properly remove mess from the string's end, start and inbetween", function() {
         expect(Scandio.string.clean).toEqual(jasmine.any(Function));

         expect(Scandio.string.clean("    Scandio     GmbH    ")).toEqual("Scandio GmbH");
      });
   });

   describe("tests on trimming a string (freeing it from mess around it)", function() {
      it("should properly remove mess from the string's start", function() {
         expect(Scandio.string.trim).toEqual(jasmine.any(Function));

         expect(Scandio.string.trim("    Scandio GmbH")).toEqual("Scandio GmbH");
      });

      it("should properly remove mess from the string's end", function() {
         expect(Scandio.string.trim).toEqual(jasmine.any(Function));

         expect(Scandio.string.trim("Scandio GmbH    ")).toEqual("Scandio GmbH");
      });

      it("should properly remove mess from the string's end and start", function() {
         expect(Scandio.string.trim).toEqual(jasmine.any(Function));

         expect(Scandio.string.trim("    Scandio GmbH    ")).toEqual("Scandio GmbH");
      });

      it("should not remove mess inbetween the string", function() {
         expect(Scandio.string.trim).toEqual(jasmine.any(Function));

         expect(Scandio.string.trim("    Scandio     GmbH    ")).toEqual("Scandio     GmbH");
      });
   });

   describe("tests on chopping a string into subparts", function() {
      it("should properly chop up a string", function() {
         expect(Scandio.string.chop).toEqual(jasmine.any(Function));

         expect(Scandio.string.chop("Scandio", 3)).toEqual(["Sca", "ndi", "o"]);
         expect(Scandio.string.chop("Scandio GmbH", 2)).toEqual(["Sc", "an", "di", "o ", "Gm", "bH"]);
      });
   });

   describe("tests on searching for substrings within a string", function() {
      it("should find a substring at the start of the string given", function() {
         expect(Scandio.string.contains).toEqual(jasmine.any(Function));

         expect(Scandio.string.contains("Scan", "Scandio GmbH")).toBe(true);
         expect(Scandio.string.contains("Scandio", "Scandio GmbH")).toBe(true);

         expect(Scandio.string.contains("Scandio a", "Scandio GmbH")).toBe(false);
         expect(Scandio.string.contains("Scanda", "Scandio GmbH")).toBe(false);
      });

      it("should find a substring at the end of the string given", function() {
         expect(Scandio.string.contains).toEqual(jasmine.any(Function));

         expect(Scandio.string.contains("GmbH", "Scandio GmbH")).toBe(true);
         expect(Scandio.string.contains("o GmbH", "Scandio GmbH")).toBe(true);

         expect(Scandio.string.contains("abH", "Scandio GmbH")).toBe(false);
         expect(Scandio.string.contains("aio GmbH", "Scandio GmbH")).toBe(false);
      });

      it("should find a substring at the the middle of the string given", function() {
         expect(Scandio.string.contains).toEqual(jasmine.any(Function));

         expect(Scandio.string.contains("io Gm", "Scandio GmbH")).toBe(true);
         expect(Scandio.string.contains("andi", "Scandio GmbH")).toBe(true);

         expect(Scandio.string.contains("dy", "Scandio GmbH")).toBe(false);
      });
   });

   describe("tests on checking the start/beginning of a string", function() {
      it("should properly check against the string's start", function() {
         expect(Scandio.string.starts).toEqual(jasmine.any(Function));

         expect(Scandio.string.starts("Scandio GmbH", "Sc")).toBe(true);
         expect(Scandio.string.starts("Scandio GmbH", "Scandio ")).toBe(true);
      });

      it("should falsly check against the string's start", function() {
         expect(Scandio.string.starts("Scandio GmbH", "Scandio x")).toBe(false);
         expect(Scandio.string.starts("Scandio GmbH", "Scandy")).toBe(false);
      });
   });

   describe("tests on checking the end of a string", function() {
      it("should properly check against the string's end", function() {
         expect(Scandio.string.ends).toEqual(jasmine.any(Function));

         expect(Scandio.string.ends("Scandio GmbH", "GmbH")).toBe(true);
         expect(Scandio.string.ends("Scandio GmbH", "io GmbH")).toBe(true);
      });

      it("should falsly check against the string's start", function() {
         expect(Scandio.string.ends("Scandio GmbH", "yio GmbH")).toBe(false);
         expect(Scandio.string.ends("Scandio GmbH", "dbH")).toBe(false);
      });
   });

   describe("tests on exploding a string", function() {
      it("should explode a string by delimiter into an array (space)", function() {
         expect(Scandio.string.explode).toEqual(jasmine.any(Function));

         expect(Scandio.string.explode("Scandio GmbH", " ")).toEqual(["Scandio", "GmbH"]);
      });

      it("should explode a string by delimiter into an array (-)", function() {
         expect(Scandio.string.explode("Sc-an-dio-Gmb-H", "-")).toEqual(["Sc", "an", "dio", "Gmb", "H"]);
      });
   });

   describe("tests on imploding an array into an string", function() {
      it("should implode an array by delimiter into an string (-)", function() {
         expect(Scandio.string.implode("-", ["Sc", "an", "dio", "Gmb", "H"])).toEqual("Sc-an-dio-Gmb-H");
      });
   });
});