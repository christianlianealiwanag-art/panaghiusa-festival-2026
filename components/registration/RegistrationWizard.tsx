"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaSchool,
  FaShieldAlt,
} from "react-icons/fa";

import { supabase } from "@/lib/supabase";

/* =========================================================
   CLAVER BARANGAYS
   Update this list if you want to change the display order.
========================================================= */

const CLAVER_BARANGAYS = [
  "Bagakay",
  "Cabugo",
  "Cagdianao",
  "Daywan",
  "Hayanggabon",
  "Ladgaron",
  "Magallanes",
  "Panatao",
  "Sapa",
  "Taganito",
  "Tayaga",
  "Urbiztondo",
  "Wangke",
];

/* =========================================================
   FORM TYPE
========================================================= */

type FormData = {
  /* Parent / Guardian */
  parentSurname: string;
  parentFirstName: string;
  parentMiddleName: string;
  relationship: string;
  email: string;
  phone: string;

  /* Child */
  childSurname: string;
  childFirstName: string;
  childMiddleName: string;
  age: string;
  gender: string;

  /* Eligibility */
  livesInClaver: string;
  barangay: string;
  purok: string;

  studiesInClaver: string;
  schoolName: string;

  /* Emergency */
  emergencyName: string;
  emergencyPhone: string;

  /* Agreements */
  kitDisclaimerAccepted: boolean;
  waiverAccepted: boolean;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

/* =========================================================
   INITIAL VALUES
========================================================= */

const initialForm: FormData = {
  parentSurname: "",
  parentFirstName: "",
  parentMiddleName: "",
  relationship: "",
  email: "",
  phone: "",

  childSurname: "",
  childFirstName: "",
  childMiddleName: "",
  age: "",
  gender: "",

  livesInClaver: "",
  barangay: "",
  purok: "",

  studiesInClaver: "",
  schoolName: "",

  emergencyName: "",
  emergencyPhone: "",

  kitDisclaimerAccepted: false,
  waiverAccepted: false,
};

/* =========================================================
   COMPONENT
========================================================= */

export default function RegistrationWizard() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  /* =======================================================
     GENERAL INPUT HANDLER
  ======================================================= */

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const fieldName = name as keyof FormData;

    setForm((previousForm) => {
      const updatedForm = {
        ...previousForm,
        [fieldName]: value,
      };

      /*
       * Reset dependent fields whenever eligibility changes.
       */

      if (name === "livesInClaver") {
        if (value === "Yes") {
          updatedForm.studiesInClaver = "";
          updatedForm.schoolName = "";
        }

        if (value === "No") {
          updatedForm.barangay = "";
          updatedForm.purok = "";
        }
      }

      if (
        name === "studiesInClaver" &&
        value === "No"
      ) {
        updatedForm.schoolName = "";
      }

      return updatedForm;
    });

    setErrors((previousErrors) => ({
      ...previousErrors,
      [fieldName]: undefined,
    }));
  };

  /* =======================================================
     CHECKBOX HANDLER
  ======================================================= */

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;
    const fieldName = name as keyof FormData;

    setForm((previousForm) => ({
      ...previousForm,
      [fieldName]: checked,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [fieldName]: undefined,
    }));
  };

  /* =======================================================
     EMAIL VALIDATION
  ======================================================= */

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  /* =======================================================
     PHONE VALIDATION
  ======================================================= */

  const normalizePhoneNumber = (phone: string) => {
    return phone.replace(/[\s()-]/g, "");
  };

  const isValidPhoneNumber = (phone: string) => {
    const normalizedPhone = normalizePhoneNumber(phone);

    return (
      /^09\d{9}$/.test(normalizedPhone) ||
      /^\+639\d{9}$/.test(normalizedPhone)
    );
  };

  /* =======================================================
     NAME HELPERS

     Combine the separate Surname / First Name / Middle Name
     fields into a single display name, and build a
     normalized "key" used to detect duplicate child
     registrations regardless of spacing, case, or
     punctuation differences.
  ======================================================= */

  const buildFullName = (
    surname: string,
    firstName: string,
    middleName: string
  ) => {
    return [firstName, middleName, surname]
      .map((part) => part.trim())
      .filter(Boolean)
      .join(" ");
  };

  const buildNameKey = (
    surname: string,
    firstName: string,
    middleName: string
  ) => {
    /*
     * Only the middle name's first letter is used, so that
     * "Aliwanag" and "A." (or a blank middle name) are
     * treated as the same child instead of allowing a
     * duplicate registration through inconsistent middle
     * name formatting.
     */
    const middleInitial = middleName
      .trim()
      .charAt(0);

    return `${surname}${firstName}${middleInitial}`
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  };

  /* =======================================================
     ELIGIBILITY HELPER
  ======================================================= */

  const childIsEligible =
    form.livesInClaver === "Yes" ||
    (form.livesInClaver === "No" &&
      form.studiesInClaver === "Yes");

  const childIsNotEligible =
    form.livesInClaver === "No" &&
    form.studiesInClaver === "No";

  /* =======================================================
     STEP 1 VALIDATION
  ======================================================= */

  const validateStep1 = () => {
    const newErrors: FormErrors = {};

    if (!form.parentSurname.trim()) {
      newErrors.parentSurname =
        "Parent or guardian surname is required.";
    }

    if (!form.parentFirstName.trim()) {
      newErrors.parentFirstName =
        "Parent or guardian first name is required.";
    }

    if (!form.relationship) {
      newErrors.relationship =
        "Please select your relationship to the child.";
    }

    if (!form.email.trim()) {
      newErrors.email =
        "Email address is required.";
    } else if (!isValidEmail(form.email.trim())) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!form.phone.trim()) {
      newErrors.phone =
        "Mobile number is required.";
    } else if (!isValidPhoneNumber(form.phone)) {
      newErrors.phone =
        "Enter an 11-digit Philippine mobile number starting with 09.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =======================================================
     STEP 2 VALIDATION
  ======================================================= */

  const validateStep2 = () => {
    const newErrors: FormErrors = {};
    const childAge = Number(form.age);

    if (!form.childSurname.trim()) {
      newErrors.childSurname =
        "Child's surname is required.";
    }

    if (!form.childFirstName.trim()) {
      newErrors.childFirstName =
        "Child's first name is required.";
    }

    if (!form.age.trim()) {
      newErrors.age =
        "Child's age is required.";
    } else if (
      !Number.isInteger(childAge) ||
      childAge < 3 ||
      childAge > 10
    ) {
      newErrors.age =
        "Only children ages 3 to 10 years old may register.";
    }

    if (!form.gender) {
      newErrors.gender =
        "Please select the child's gender.";
    }

    /* -------------------------
       Eligibility
    ------------------------- */

    if (!form.livesInClaver) {
      newErrors.livesInClaver =
        "Please indicate whether the child lives in Claver.";
    }

    /*
     * Resident of Claver
     */
    if (form.livesInClaver === "Yes") {
      if (!form.barangay) {
        newErrors.barangay =
          "Please select the child's barangay in Claver.";
      }
    }

    /*
     * Not resident of Claver
     */
    if (form.livesInClaver === "No") {
      if (!form.studiesInClaver) {
        newErrors.studiesInClaver =
          "Please indicate whether the child attends a school located in Claver.";
      }

      if (
        form.studiesInClaver === "Yes" &&
        !form.schoolName.trim()
      ) {
        newErrors.schoolName =
          "Please enter the name of the child's school in Claver.";
      }
    }

    /* -------------------------
       Emergency Contact
    ------------------------- */

    if (!form.emergencyName.trim()) {
      newErrors.emergencyName =
        "Emergency contact person is required.";
    }

    if (!form.emergencyPhone.trim()) {
      newErrors.emergencyPhone =
        "Emergency contact number is required.";
    } else if (
      !isValidPhoneNumber(form.emergencyPhone)
    ) {
      newErrors.emergencyPhone =
        "Enter an 11-digit Philippine mobile number starting with 09.";
    }

    setErrors(newErrors);

    if (childIsNotEligible) {
      return false;
    }

    return Object.keys(newErrors).length === 0;
  };

  /* =======================================================
     STEP 3 VALIDATION
  ======================================================= */

  const validateStep3 = () => {
    const newErrors: FormErrors = {};

    if (!form.kitDisclaimerAccepted) {
      newErrors.kitDisclaimerAccepted =
        "Please acknowledge the Safari Explorer Kit notice.";
    }

    if (!form.waiverAccepted) {
      newErrors.waiverAccepted =
        "Please read and accept the Parent/Guardian Waiver and Consent.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =======================================================
     VALIDATE EVERYTHING
  ======================================================= */

  const validateAllSteps = () => {
    if (!validateStep1()) {
      setStep(1);
      return false;
    }

    if (!validateStep2()) {
      setStep(2);
      return false;
    }

    if (!validateStep3()) {
      setStep(3);
      return false;
    }

    return true;
  };

  /* =======================================================
     NEXT
  ======================================================= */

  const next = () => {
    if (step === 1 && !validateStep1()) {
      return;
    }

    if (step === 2 && !validateStep2()) {
      return;
    }

    setStep((previousStep) =>
      Math.min(previousStep + 1, 3)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     BACK
  ======================================================= */

  const back = () => {
    setErrors({});

    setStep((previousStep) =>
      Math.max(previousStep - 1, 1)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const submit = async () => {
    if (loading) {
      return;
    }

    if (!validateAllSteps()) {
      return;
    }

    if (!childIsEligible) {
      alert(
        "This child does not meet the eligibility requirements for the festival."
      );
      return;
    }

    setLoading(true);

    try {
      const childNameKey = buildNameKey(
        form.childSurname,
        form.childFirstName,
        form.childMiddleName
      );

      /*
       * Check for an existing registration under
       * the same child name before inserting, so we
       * can show a friendly message instead of a
       * raw database error in the common case.
       */
      const { data: existingChild, error: existingChildError } =
        await supabase
          .from("registrations")
          .select("id")
          .eq("child_name_key", childNameKey)
          .limit(1);

      if (existingChildError) {
        console.error(
          "Duplicate check error:",
          existingChildError
        );
      }

      if (existingChild && existingChild.length > 0) {
        alert(
          "This child is already registered for the festival. Each child may only be registered once."
        );
        return;
      }

      const { data, error } = await supabase
        .from("registrations")
        .insert([
          {
            /* Child */
            child_name:
              buildFullName(
                form.childSurname,
                form.childFirstName,
                form.childMiddleName
              ),

            child_surname:
              form.childSurname.trim(),

            child_first_name:
              form.childFirstName.trim(),

            child_middle_name:
              form.childMiddleName.trim() || null,

            child_name_key:
              childNameKey,

            age:
              Number(form.age),

            sex:
              form.gender,

            /* Parent */
            parent_name:
              buildFullName(
                form.parentSurname,
                form.parentFirstName,
                form.parentMiddleName
              ),

            parent_surname:
              form.parentSurname.trim(),

            parent_first_name:
              form.parentFirstName.trim(),

            parent_middle_name:
              form.parentMiddleName.trim() || null,

            relationship:
              form.relationship,

            contact_number:
              normalizePhoneNumber(form.phone),

            email:
              form.email.trim().toLowerCase(),

            /* Eligibility */
            lives_in_claver:
              form.livesInClaver === "Yes",

            barangay:
              form.livesInClaver === "Yes"
                ? form.barangay
                : null,

            purok:
              form.livesInClaver === "Yes"
                ? form.purok.trim() || null
                : null,

            studies_in_claver:
              form.livesInClaver === "No"
                ? form.studiesInClaver === "Yes"
                : null,

            school_name:
              form.livesInClaver === "No" &&
              form.studiesInClaver === "Yes"
                ? form.schoolName.trim()
                : null,

            /* Emergency */
            emergency_contact:
              form.emergencyName.trim(),

            emergency_number:
              normalizePhoneNumber(
                form.emergencyPhone
              ),

            /* Consent */
            kit_disclaimer_accepted:
              form.kitDisclaimerAccepted,

            waiver_accepted:
              form.waiverAccepted,

            waiver_accepted_at:
              new Date().toISOString(),

            /* Check-in */
            checked_in:
              false,
          },
        ])
        .select("explorer_no")
        .single();

      if (error) {
        console.error(
          "Registration error:",
          error
        );

        /*
         * Postgres unique_violation. This is the
         * authoritative guard against duplicate child
         * registrations (in case two submissions raced
         * past the earlier pre-check).
         */
        if (error.code === "23505") {
          alert(
            "This child is already registered for the festival. Each child may only be registered once."
          );
          return;
        }

        alert(error.message);
        return;
      }

      if (!data?.explorer_no) {
        alert(
          "The registration was saved, but no Explorer Number was returned."
        );
        return;
      }

      /*
       * Send Explorer Number to success page.
       * Your success page can generate the QR Code
       * using this Explorer Number.
       */
      router.push(
        `/success?id=${encodeURIComponent(
          data.explorer_no
        )}`
      );
    } catch (error) {
      console.error(
        "Unexpected registration error:",
        error
      );

      alert(
        "Something went wrong while saving the registration. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INPUT STYLE
  ======================================================= */

  const inputClassName = (
    fieldName: keyof FormData
  ) => {
    return `w-full rounded-xl border p-4 outline-none transition ${
      errors[fieldName]
        ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
        : "border-gray-300 bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
    }`;
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-700 via-green-600 to-yellow-400 px-4 py-12 md:py-20">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="bg-green-800 p-6 text-white md:p-8">
          <h1 className="text-3xl font-black md:text-4xl">
            🦁 Safari Adventure Registration
          </h1>

          <p className="mt-2 opacity-90">
            Claver Children&apos;s Festival 2026
          </p>

          <div className="mt-8">
            <div className="h-3 w-full rounded-full bg-green-600">
              <div
                className="h-3 rounded-full bg-yellow-400 transition-all duration-500"
                style={{
                  width:
                    step === 1
                      ? "33%"
                      : step === 2
                        ? "66%"
                        : "100%",
                }}
              />
            </div>

            <div className="mt-3 flex justify-between text-sm">
              <span
                className={
                  step >= 1
                    ? "font-bold"
                    : ""
                }
              >
                Parent
              </span>

              <span
                className={
                  step >= 2
                    ? "font-bold"
                    : ""
                }
              >
                Child
              </span>

              <span
                className={
                  step === 3
                    ? "font-bold"
                    : ""
                }
              >
                Review & Consent
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10">

          {/* =================================================
              STEP 1
          ================================================= */}

          {step === 1 && (
            <>
              <h2 className="mb-2 text-2xl font-bold text-green-800 md:text-3xl">
                👨‍👩‍👧 Parent / Guardian Information
              </h2>

              <p className="mb-8 text-sm text-gray-600">
                Please provide the contact
                information of the parent or
                guardian responsible for the
                child.
              </p>

              <div className="space-y-5">

                {/* Parent Name */}

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="parentSurname"
                      className="mb-2 block font-semibold text-gray-700"
                    >
                      Surname{" "}
                      <span className="text-red-600">
                        *
                      </span>
                    </label>

                    <input
                      id="parentSurname"
                      name="parentSurname"
                      type="text"
                      placeholder="Surname"
                      value={form.parentSurname}
                      onChange={handleChange}
                      autoComplete="family-name"
                      className={inputClassName(
                        "parentSurname"
                      )}
                    />

                    {errors.parentSurname && (
                      <p className="mt-2 text-sm font-medium text-red-600">
                        {errors.parentSurname}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="parentFirstName"
                      className="mb-2 block font-semibold text-gray-700"
                    >
                      First Name{" "}
                      <span className="text-red-600">
                        *
                      </span>
                    </label>

                    <input
                      id="parentFirstName"
                      name="parentFirstName"
                      type="text"
                      placeholder="First name"
                      value={form.parentFirstName}
                      onChange={handleChange}
                      autoComplete="given-name"
                      className={inputClassName(
                        "parentFirstName"
                      )}
                    />

                    {errors.parentFirstName && (
                      <p className="mt-2 text-sm font-medium text-red-600">
                        {errors.parentFirstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="parentMiddleName"
                      className="mb-2 block font-semibold text-gray-700"
                    >
                      Middle Name
                    </label>

                    <input
                      id="parentMiddleName"
                      name="parentMiddleName"
                      type="text"
                      placeholder="Middle name"
                      value={form.parentMiddleName}
                      onChange={handleChange}
                      autoComplete="additional-name"
                      className={inputClassName(
                        "parentMiddleName"
                      )}
                    />
                  </div>
                </div>

                {/* Relationship */}

                <div>
                  <label
                    htmlFor="relationship"
                    className="mb-2 block font-semibold text-gray-700"
                  >
                    Relationship to Child{" "}
                    <span className="text-red-600">
                      *
                    </span>
                  </label>

                  <select
                    id="relationship"
                    name="relationship"
                    value={form.relationship}
                    onChange={handleChange}
                    className={inputClassName(
                      "relationship"
                    )}
                  >
                    <option value="">
                      Select relationship
                    </option>

                    <option value="Mother">
                      Mother
                    </option>

                    <option value="Father">
                      Father
                    </option>

                    <option value="Grandparent">
                      Grandparent
                    </option>

                    <option value="Sibling">
                      Sibling
                    </option>

                    <option value="Legal Guardian">
                      Legal Guardian
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>

                  {errors.relationship && (
                    <p className="mt-2 text-sm font-medium text-red-600">
                      {errors.relationship}
                    </p>
                  )}
                </div>

                {/* Email */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block font-semibold text-gray-700"
                  >
                    Email Address{" "}
                    <span className="text-red-600">
                      *
                    </span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className={inputClassName(
                      "email"
                    )}
                  />

                  {errors.email && (
                    <p className="mt-2 text-sm font-medium text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Mobile */}

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block font-semibold text-gray-700"
                  >
                    Mobile Number{" "}
                    <span className="text-red-600">
                      *
                    </span>
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={11}
                    placeholder="09XXXXXXXXX"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    className={inputClassName(
                      "phone"
                    )}
                  />

                  {errors.phone ? (
                    <p className="mt-2 text-sm font-medium text-red-600">
                      {errors.phone}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-gray-500">
                      Use an 11-digit Philippine
                      mobile number.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  type="button"
                  onClick={next}
                  className="flex items-center gap-3 rounded-full bg-green-700 px-8 py-4 font-bold text-white transition hover:bg-green-800"
                >
                  Next
                  <FaArrowRight />
                </button>
              </div>
            </>
          )}

          {/* =================================================
              STEP 2
          ================================================= */}

          {step === 2 && (
            <>
              <h2 className="mb-2 text-2xl font-bold text-green-800 md:text-3xl">
                🦒 Child Information
              </h2>

              <p className="mb-8 text-sm text-gray-600">
                The festival is open to children
                ages 3–10 who either live in
                Claver or attend a school located
                in Claver.
              </p>

              <div className="space-y-6">

                {/* Child Name */}

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="childSurname"
                      className="mb-2 block font-semibold text-gray-700"
                    >
                      Surname{" "}
                      <span className="text-red-600">
                        *
                      </span>
                    </label>

                    <input
                      id="childSurname"
                      name="childSurname"
                      type="text"
                      placeholder="Surname"
                      value={form.childSurname}
                      onChange={handleChange}
                      className={inputClassName(
                        "childSurname"
                      )}
                    />

                    {errors.childSurname && (
                      <p className="mt-2 text-sm font-medium text-red-600">
                        {errors.childSurname}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="childFirstName"
                      className="mb-2 block font-semibold text-gray-700"
                    >
                      First Name{" "}
                      <span className="text-red-600">
                        *
                      </span>
                    </label>

                    <input
                      id="childFirstName"
                      name="childFirstName"
                      type="text"
                      placeholder="First name"
                      value={form.childFirstName}
                      onChange={handleChange}
                      className={inputClassName(
                        "childFirstName"
                      )}
                    />

                    {errors.childFirstName && (
                      <p className="mt-2 text-sm font-medium text-red-600">
                        {errors.childFirstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="childMiddleName"
                      className="mb-2 block font-semibold text-gray-700"
                    >
                      Middle Name
                    </label>

                    <input
                      id="childMiddleName"
                      name="childMiddleName"
                      type="text"
                      placeholder="Middle name"
                      value={form.childMiddleName}
                      onChange={handleChange}
                      className={inputClassName(
                        "childMiddleName"
                      )}
                    />
                  </div>
                </div>

                {/* Age */}

                <div>
                  <label
                    htmlFor="age"
                    className="mb-2 block font-semibold text-gray-700"
                  >
                    Age{" "}
                    <span className="text-red-600">
                      *
                    </span>
                  </label>

                  <input
                    id="age"
                    name="age"
                    type="number"
                    inputMode="numeric"
                    min="3"
                    max="10"
                    placeholder="3 to 10 years old"
                    value={form.age}
                    onChange={handleChange}
                    className={inputClassName(
                      "age"
                    )}
                  />

                  {errors.age && (
                    <p className="mt-2 text-sm font-medium text-red-600">
                      {errors.age}
                    </p>
                  )}
                </div>

                {/* Gender */}

                <div>
                  <label
                    htmlFor="gender"
                    className="mb-2 block font-semibold text-gray-700"
                  >
                    Gender{" "}
                    <span className="text-red-600">
                      *
                    </span>
                  </label>

                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className={inputClassName(
                      "gender"
                    )}
                  >
                    <option value="">
                      Select Gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>
                  </select>

                  {errors.gender && (
                    <p className="mt-2 text-sm font-medium text-red-600">
                      {errors.gender}
                    </p>
                  )}
                </div>

                {/* ==========================================
                    ELIGIBILITY SECTION
                ========================================== */}

                <div className="rounded-2xl border border-green-200 bg-green-50 p-5 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <FaMapMarkerAlt className="text-2xl text-green-700" />

                    <div>
                      <h3 className="text-xl font-bold text-green-800">
                        Residency / School
                        Eligibility
                      </h3>

                      <p className="text-sm text-gray-600">
                        This information will be
                        used only to verify event
                        eligibility.
                      </p>
                    </div>
                  </div>

                  {/* Lives in Claver */}

                  <div>
                    <label
                      htmlFor="livesInClaver"
                      className="mb-2 block font-semibold text-gray-700"
                    >
                      Does the child currently
                      live in Claver?{" "}
                      <span className="text-red-600">
                        *
                      </span>
                    </label>

                    <select
                      id="livesInClaver"
                      name="livesInClaver"
                      value={form.livesInClaver}
                      onChange={handleChange}
                      className={inputClassName(
                        "livesInClaver"
                      )}
                    >
                      <option value="">
                        Select answer
                      </option>

                      <option value="Yes">
                        Yes
                      </option>

                      <option value="No">
                        No
                      </option>
                    </select>

                    {errors.livesInClaver && (
                      <p className="mt-2 text-sm font-medium text-red-600">
                        {
                          errors.livesInClaver
                        }
                      </p>
                    )}
                  </div>

                  {/* Resident address */}

                  {form.livesInClaver ===
                    "Yes" && (
                    <div className="mt-5 space-y-5 rounded-xl bg-white p-5">

                      <p className="font-bold text-green-800">
                        Child&apos;s Address in
                        Claver
                      </p>

                      <div>
                        <label
                          htmlFor="barangay"
                          className="mb-2 block font-semibold text-gray-700"
                        >
                          Barangay{" "}
                          <span className="text-red-600">
                            *
                          </span>
                        </label>

                        <select
                          id="barangay"
                          name="barangay"
                          value={form.barangay}
                          onChange={
                            handleChange
                          }
                          className={inputClassName(
                            "barangay"
                          )}
                        >
                          <option value="">
                            Select Barangay
                          </option>

                          {CLAVER_BARANGAYS.map(
                            (barangay) => (
                              <option
                                key={barangay}
                                value={barangay}
                              >
                                {barangay}
                              </option>
                            )
                          )}
                        </select>

                        {errors.barangay && (
                          <p className="mt-2 text-sm font-medium text-red-600">
                            {errors.barangay}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="purok"
                          className="mb-2 block font-semibold text-gray-700"
                        >
                          Purok / Sitio / Street
                        </label>

                        <input
                          id="purok"
                          name="purok"
                          type="text"
                          placeholder="Optional"
                          value={form.purok}
                          onChange={
                            handleChange
                          }
                          className={inputClassName(
                            "purok"
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Non-resident follow up */}

                  {form.livesInClaver ===
                    "No" && (
                    <div className="mt-5 space-y-5 rounded-xl border border-blue-200 bg-blue-50 p-5">

                      <div className="flex items-start gap-3">
                        <FaSchool className="mt-1 text-xl text-blue-700" />

                        <div className="w-full">
                          <label
                            htmlFor="studiesInClaver"
                            className="mb-2 block font-semibold text-gray-700"
                          >
                            Does the child
                            currently attend a
                            school located in
                            Claver?{" "}
                            <span className="text-red-600">
                              *
                            </span>
                          </label>

                          <select
                            id="studiesInClaver"
                            name="studiesInClaver"
                            value={
                              form.studiesInClaver
                            }
                            onChange={
                              handleChange
                            }
                            className={inputClassName(
                              "studiesInClaver"
                            )}
                          >
                            <option value="">
                              Select answer
                            </option>

                            <option value="Yes">
                              Yes
                            </option>

                            <option value="No">
                              No
                            </option>
                          </select>

                          {errors.studiesInClaver && (
                            <p className="mt-2 text-sm font-medium text-red-600">
                              {
                                errors.studiesInClaver
                              }
                            </p>
                          )}
                        </div>
                      </div>

                      {/* School */}

                      {form.studiesInClaver ===
                        "Yes" && (
                        <div>
                          <label
                            htmlFor="schoolName"
                            className="mb-2 block font-semibold text-gray-700"
                          >
                            Name of School in
                            Claver{" "}
                            <span className="text-red-600">
                              *
                            </span>
                          </label>

                          <input
                            id="schoolName"
                            name="schoolName"
                            type="text"
                            placeholder="Enter complete school name"
                            value={
                              form.schoolName
                            }
                            onChange={
                              handleChange
                            }
                            className={inputClassName(
                              "schoolName"
                            )}
                          />

                          {errors.schoolName && (
                            <p className="mt-2 text-sm font-medium text-red-600">
                              {
                                errors.schoolName
                              }
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Not Eligible */}

                  {childIsNotEligible && (
                    <div className="mt-5 rounded-xl border-2 border-red-300 bg-red-50 p-5">
                      <div className="flex items-start gap-3">
                        <FaExclamationTriangle className="mt-1 text-2xl text-red-600" />

                        <div>
                          <p className="font-bold text-red-700">
                            Not Eligible for
                            Registration
                          </p>

                          <p className="mt-2 text-sm leading-6 text-red-700">
                            The Claver
                            Children&apos;s
                            Festival is open to
                            children ages 3–10
                            who either live in
                            Claver or attend a
                            school located in
                            Claver.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ==========================================
                    EMERGENCY CONTACT
                ========================================== */}

                <div className="pt-3">
                  <h3 className="mb-4 text-xl font-bold text-green-800">
                    🚑 Emergency Contact
                  </h3>

                  <div className="space-y-5">

                    <div>
                      <label
                        htmlFor="emergencyName"
                        className="mb-2 block font-semibold text-gray-700"
                      >
                        Emergency Contact
                        Person{" "}
                        <span className="text-red-600">
                          *
                        </span>
                      </label>

                      <input
                        id="emergencyName"
                        name="emergencyName"
                        type="text"
                        placeholder="Enter emergency contact name"
                        value={
                          form.emergencyName
                        }
                        onChange={
                          handleChange
                        }
                        className={inputClassName(
                          "emergencyName"
                        )}
                      />

                      {errors.emergencyName && (
                        <p className="mt-2 text-sm font-medium text-red-600">
                          {
                            errors.emergencyName
                          }
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="emergencyPhone"
                        className="mb-2 block font-semibold text-gray-700"
                      >
                        Emergency Contact
                        Number{" "}
                        <span className="text-red-600">
                          *
                        </span>
                      </label>

                      <input
                        id="emergencyPhone"
                        name="emergencyPhone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={11}
                        placeholder="09XXXXXXXXX"
                        value={
                          form.emergencyPhone
                        }
                        onChange={
                          handleChange
                        }
                        className={inputClassName(
                          "emergencyPhone"
                        )}
                      />

                      {errors.emergencyPhone ? (
                        <p className="mt-2 text-sm font-medium text-red-600">
                          {
                            errors.emergencyPhone
                          }
                        </p>
                      ) : (
                        <p className="mt-2 text-xs text-gray-500">
                          Use an 11-digit
                          Philippine mobile
                          number.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">

                <button
                  type="button"
                  onClick={back}
                  className="flex items-center justify-center gap-3 rounded-full bg-gray-300 px-8 py-4 font-bold text-gray-800 transition hover:bg-gray-400"
                >
                  <FaArrowLeft />
                  Back
                </button>

                <button
                  type="button"
                  onClick={next}
                  disabled={
                    childIsNotEligible
                  }
                  className="flex items-center justify-center gap-3 rounded-full bg-green-700 px-8 py-4 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  Review
                  <FaArrowRight />
                </button>
              </div>
            </>
          )}

          {/* =================================================
              STEP 3
          ================================================= */}

          {step === 3 && (
            <>
              <div className="text-center">
                <FaCheckCircle className="mx-auto text-7xl text-green-600" />

                <h2 className="mt-6 text-3xl font-black md:text-4xl">
                  Review & Consent
                </h2>

                <p className="mt-3 text-gray-600">
                  Please review all information
                  and read the acknowledgments
                  before submitting.
                </p>
              </div>

              {/* =============================================
                  REVIEW
              ============================================= */}

              <div className="mt-10 space-y-4 rounded-2xl bg-yellow-50 p-6 md:p-8">

                <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
                  Parent / Guardian Information
                </p>

                <p>
                  <strong>
                    Parent / Guardian:
                  </strong>{" "}
                  {buildFullName(
                    form.parentSurname,
                    form.parentFirstName,
                    form.parentMiddleName
                  )}
                </p>

                <p>
                  <strong>
                    Relationship:
                  </strong>{" "}
                  {form.relationship}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {form.email}
                </p>

                <p>
                  <strong>
                    Mobile Number:
                  </strong>{" "}
                  {form.phone}
                </p>

                <hr className="border-yellow-200" />

                <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
                  Child Information
                </p>

                <p>
                  <strong>Child:</strong>{" "}
                  {buildFullName(
                    form.childSurname,
                    form.childFirstName,
                    form.childMiddleName
                  )}
                </p>

                <p>
                  <strong>Age:</strong>{" "}
                  {form.age}
                </p>

                <p>
                  <strong>Gender:</strong>{" "}
                  {form.gender}
                </p>

                <p>
                  <strong>
                    Lives in Claver:
                  </strong>{" "}
                  {form.livesInClaver}
                </p>

                {form.livesInClaver ===
                  "Yes" && (
                  <>
                    <p>
                      <strong>
                        Barangay:
                      </strong>{" "}
                      {form.barangay}
                    </p>

                    {form.purok && (
                      <p>
                        <strong>
                          Purok / Sitio /
                          Street:
                        </strong>{" "}
                        {form.purok}
                      </p>
                    )}
                  </>
                )}

                {form.livesInClaver ===
                  "No" && (
                  <>
                    <p>
                      <strong>
                        Attends School in
                        Claver:
                      </strong>{" "}
                      {
                        form.studiesInClaver
                      }
                    </p>

                    <p>
                      <strong>
                        School:
                      </strong>{" "}
                      {form.schoolName}
                    </p>
                  </>
                )}

                <hr className="border-yellow-200" />

                <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
                  Emergency Contact
                </p>

                <p>
                  <strong>
                    Emergency Contact:
                  </strong>{" "}
                  {form.emergencyName}
                </p>

                <p>
                  <strong>
                    Emergency Number:
                  </strong>{" "}
                  {form.emergencyPhone}
                </p>
              </div>

              {/* =============================================
                  PRE-REGISTRATION NOTICE
              ============================================= */}

              <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
                <h3 className="text-xl font-bold text-blue-900">
                  📱 Pre-Registration Notice
                </h3>

                <p className="mt-3 leading-7 text-gray-700">
                  Pre-registration helps the
                  organizers estimate the
                  expected number of children,
                  prepare event logistics and
                  resources, and facilitate a
                  faster and more organized
                  check-in process on the day of
                  the festival.
                </p>

                <p className="mt-3 leading-7 text-gray-700">
                  Upon successful registration,
                  an Explorer Number will be
                  issued. This may be used for
                  QR-based verification and
                  faster check-in at the venue.
                </p>
              </div>

              {/* =============================================
                  KIT DISCLAIMER
              ============================================= */}

              <div className="mt-6 rounded-2xl border-2 border-orange-300 bg-orange-50 p-6">
                <h3 className="text-xl font-bold text-orange-900">
                  🎒 Important Notice on Safari
                  Explorer Kits
                </h3>

                <p className="mt-3 leading-7 text-gray-700">
                  Safari Explorer Kits are
                  available{" "}
                  <strong>
                    while supplies last.
                  </strong>
                </p>

                <p className="mt-3 leading-7 text-gray-700">
                  Pre-registration{" "}
                  <strong>
                    does not guarantee or
                    reserve a Safari Explorer
                    Kit.
                  </strong>{" "}
                  Kits will be distributed only
                  at the event venue on a{" "}
                  <strong>
                    first-come, first-served
                    basis
                  </strong>{" "}
                  while supplies are available.
                </p>

                <p className="mt-3 leading-7 text-gray-700">
                  The registered child must be
                  physically present at the
                  venue to claim the kit.
                </p>

                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl bg-white p-4">
                  <input
                    type="checkbox"
                    name="kitDisclaimerAccepted"
                    checked={
                      form.kitDisclaimerAccepted
                    }
                    onChange={
                      handleCheckboxChange
                    }
                    className="mt-1 h-5 w-5 accent-green-700"
                  />

                  <span className="text-sm leading-6 text-gray-700">
                    <strong>
                      I understand
                    </strong>{" "}
                    that pre-registration does
                    not guarantee a Safari
                    Explorer Kit and that kits
                    will be distributed at the
                    venue on a first-come,
                    first-served basis while
                    supplies last.
                  </span>
                </label>

                {errors.kitDisclaimerAccepted && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {
                      errors.kitDisclaimerAccepted
                    }
                  </p>
                )}
              </div>

              {/* =============================================
                  WAIVER
              ============================================= */}

              <div className="mt-6 rounded-2xl border-2 border-green-300 bg-green-50 p-6">
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="text-2xl text-green-700" />

                  <h3 className="text-xl font-bold text-green-900">
                    Parent / Guardian Waiver,
                    Consent & Acknowledgment
                  </h3>
                </div>

                <div className="mt-4 space-y-4 text-sm leading-7 text-gray-700">

                  <p>
                    I certify that the
                    information provided in this
                    registration is true and
                    correct to the best of my
                    knowledge and that I am the
                    parent, legal guardian, or
                    duly authorized adult
                    responsible for the child
                    being registered.
                  </p>

                  <p>
                    I voluntarily allow the
                    child to participate in the{" "}
                    <strong>
                      Claver Children&apos;s
                      Festival – Safari
                      Adventure
                    </strong>
                    . I understand that the
                    event includes recreational,
                    educational, interactive,
                    entertainment, and
                    child-oriented activities.
                  </p>

                  <p>
                    I understand that reasonable
                    safety measures will be
                    implemented by the
                    organizers and I agree to
                    comply with all event
                    guidelines, safety
                    instructions, and directions
                    of authorized event
                    personnel.
                  </p>

                  <p>
                    In case of an emergency, I
                    authorize the event
                    organizers, designated
                    personnel, and medical
                    responders to provide
                    appropriate first aid and/or
                    facilitate necessary medical
                    assistance when reasonably
                    required.
                  </p>

                  <p>
                    I acknowledge that
                    participation is voluntary
                    and that activities such as
                    play, games, inflatable
                    attractions, arts and crafts,
                    and other interactive
                    activities may involve
                    ordinary risks associated
                    with children&apos;s
                    recreational activities.
                  </p>
                </div>

                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl bg-white p-4">
                  <input
                    type="checkbox"
                    name="waiverAccepted"
                    checked={
                      form.waiverAccepted
                    }
                    onChange={
                      handleCheckboxChange
                    }
                    className="mt-1 h-5 w-5 accent-green-700"
                  />

                  <span className="text-sm leading-6 text-gray-700">
                    I have read and understood
                    the Parent / Guardian
                    Waiver, Consent and
                    Acknowledgment above. I
                    voluntarily give my consent
                    for the child named in this
                    registration to participate
                    in the event, and I certify
                    that the information
                    provided is accurate.
                  </span>
                </label>

                {errors.waiverAccepted && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {errors.waiverAccepted}
                  </p>
                )}
              </div>

              {/* =============================================
                  FINAL BUTTONS
              ============================================= */}

              <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">

                <button
                  type="button"
                  onClick={back}
                  disabled={loading}
                  className="flex items-center justify-center gap-3 rounded-full bg-gray-300 px-8 py-4 font-bold text-gray-800 transition hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaArrowLeft />
                  Back
                </button>

                <button
                  type="button"
                  onClick={submit}
                  disabled={
                    loading ||
                    !form.kitDisclaimerAccepted ||
                    !form.waiverAccepted
                  }
                  className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-green-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-white md:px-10"
                >
                  {loading
                    ? "Saving Registration..."
                    : "🦁 Submit Registration"}
                </button>
              </div>

              {!form.kitDisclaimerAccepted ||
              !form.waiverAccepted ? (
                <p className="mt-4 text-center text-xs text-gray-500">
                  Please accept both required
                  acknowledgments before
                  submitting the registration.
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}